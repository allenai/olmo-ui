import { DevTool } from '@hookform/devtools';
import { Stack, Typography } from '@mui/material';
import { KeyboardEvent, UIEvent, useEffect, useRef, useState } from 'react';
import { DropZone } from 'react-aria-components';
import {
    Controller,
    FormContainer,
    SubmitHandler,
    useForm,
    useWatch,
    Validate,
    ValidateResult,
} from 'react-hook-form-mui';
import { useNavigation } from 'react-router-dom';

import {
    type SchemaCreateMessageRequest,
    SchemaPromptTemplateResponse,
    SchemaToolCall,
} from '@/api/playgroundApi/playgroundApiSchema';
import { useAppContext } from '@/AppContext';
import { VideoPointingInput } from '@/components/video/pointing/VideoPointing';
import { useStreamEvent } from '@/contexts/StreamEventRegistry';
import { RemoteState } from '@/contexts/util';
import { fetchFilesByUrls } from '@/utils/fetchFilesByUrl';

import { AudioInputButton } from './AudioTranscription/AudioInputButton';
import { Waveform } from './AudioTranscription/Waveform';
import { FileUploadButton, FileuploadPropsBase } from './FileUploadButton/FileUploadButton';
import { FileUploadThumbnails } from './FileUploadThumbnails/FileThumbnailDisplay';
import { useObjectUrls } from './FileUploadThumbnails/useObjectUrls';
import { handleFormSubmitException } from './handleFormSubmitException';
import { PromptContainer } from './PromptContainer';
import { PromptInput } from './PromptInput';
import { QueryFormStyledBox } from './QueryFormStyledBox';
import { SubmitPauseAdornment } from './SubmitPauseAdornment';
import { validateFiles } from './validateFiles';

export interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
    // This isn't part of the form data explicitly, but is added in the submit handler
    captchaToken?: string | null;
    role?: SchemaCreateMessageRequest['role'];
    toolCallId?: SchemaToolCall['toolCallId'];
    inputParts?: SchemaCreateMessageRequest['inputParts'];
}

interface QueryFormControllerProps {
    handleSubmit: SubmitHandler<QueryFormValues>;
    promptTemplate?: SchemaPromptTemplateResponse;
    canEditThread: boolean;
    placeholderText: string;
    autofocus: boolean;
    areFilesAllowed: boolean;
    onAbort: (e: UIEvent) => void;
    canPauseThread: boolean;
    isLimitReached: boolean;
    remoteState?: RemoteState;
    fileUploadProps: FileuploadPropsBase;
}

export const MODEL_SUPPORTS_POINTING_INPUT = true;

export const QueryFormController = ({
    handleSubmit,
    canEditThread,
    promptTemplate,
    placeholderText,
    autofocus,
    areFilesAllowed,
    onAbort,
    canPauseThread,
    isLimitReached,
    remoteState,
    fileUploadProps,
}: QueryFormControllerProps) => {
    const navigation = useNavigation();
    const getObjectUrl = useObjectUrls();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const isTranscribing = useAppContext((state) => state.isTranscribing);
    const isProcessingAudio = useAppContext((state) => state.isProcessingAudio);

    const formContext = useForm<QueryFormValues>({
        mode: 'onChange',
        defaultValues: {
            content: '',
            private: false,
            files: undefined,
        },
    });

    const [tempPlaceholder, setTempPlaceholder] = useState('');

    const isSelectedThreadLoading = remoteState === RemoteState.Loading;

    // Autofocus the input if we're on a new thread
    useEffect(() => {
        if (autofocus) {
            formContext.setFocus('content');
        }
    }, [autofocus, formContext]);

    // Clear errors when we navigate between pages
    useEffect(() => {
        if (navigation.state === 'loading') {
            formContext.clearErrors();
        }
    }, [formContext, navigation.state]);

    useStreamEvent('onFirstMessage', () => {
        formContext.reset();
    });

    useEffect(() => {
        if (promptTemplate && !formContext.formState.isDirty) {
            formContext.setValue('content', promptTemplate.content);
        }
    }, [formContext, promptTemplate]);

    useEffect(() => {
        if (!areFilesAllowed) {
            formContext.setValue('files', undefined);
        } else if (promptTemplate?.fileUrls && promptTemplate.fileUrls.length) {
            fetchFilesByUrls([...promptTemplate.fileUrls])
                .then((downloadedFiles) => {
                    const dataTransfer = new DataTransfer();
                    downloadedFiles.forEach((file) => {
                        dataTransfer.items.add(file);
                    });
                    formContext.setValue('files', dataTransfer.files);
                })
                .catch(() => undefined);
        }
    }, [formContext, areFilesAllowed, promptTemplate?.fileUrls]);

    const files = useWatch({ control: formContext.control, name: 'files' });

    // Validation function for file uploads
    const validateFilesWithOptions: Validate<FileList | undefined, QueryFormValues> = (
        fileList: FileList | undefined
    ): ValidateResult => {
        return validateFiles(fileList, {
            acceptedFileTypes: fileUploadProps.acceptedFileTypes,
            maxFilesPerMessage: fileUploadProps.maxFilesPerMessage,
            canMixFileTypes: false, // shouldn't be static
        });
    };

    const handleRemoveFile = (fileToRemove: File) => {
        if (files == null) {
            // Something weird has happened, maybe we reset the form or the user cleared it
            // We're just ignoring the removal in this case
            return;
        }

        const dataTransfer = new DataTransfer();
        for (const file of files) {
            if (file !== fileToRemove) {
                dataTransfer.items.add(file);
            }
        }

        formContext.setValue('files', dataTransfer.files, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await formContext.handleSubmit(handleSubmitController)();
        }
    };

    const handleSubmitController: SubmitHandler<QueryFormValues> = async (data) => {
        if (!canEditThread || isSelectedThreadLoading) {
            return;
        }
        try {
            await handleSubmit(data);
        } catch (e) {
            handleFormSubmitException(e, formContext);
        }
    };

    const _triggerFileSelection = () => {
        // To be used if we have an add another image button
        inputRef.current?.click();
    };

    return (
        <DropZone
            onDrop={(_dropEvent) => {
                // TODO:
                // validate
                // add to files
            }}
            getDropOperation={(_types, _allowedOperations) => {
                // TODO validate
                // return copy/cancel
                return 'cancel';
            }}>
            <QueryFormStyledBox>
                <FormContainer formContext={formContext} onSuccess={handleSubmitController}>
                    {files && MODEL_SUPPORTS_POINTING_INPUT && files.length === 1 && (
                        <Controller
                            name="inputParts"
                            control={formContext.control}
                            render={({
                                // not particularly using hook form anymore
                                field: {
                                    name,
                                    onBlur,
                                    disabled: _disabled,
                                    onChange,
                                    value: value,
                                    ref: _ref,
                                },
                            }) => {
                                return (
                                    <VideoPointingInput
                                        onRemoveFile={() => {
                                            handleRemoveFile(files[0]);
                                        }}
                                        videoUrl={getObjectUrl(files[0])}
                                        userPoint={value ? value[0] : null}
                                        setUserPoint={(point) => onChange(point ? [point] : [])}
                                    />
                                );
                            }}
                        />
                    )}
                    <Stack gap={1} alignItems="flex-start" width={1} position="relative">
                        <FileUploadThumbnails
                            files={files}
                            onRemoveFile={handleRemoveFile}
                            acceptedFileTypes={fileUploadProps.acceptedFileTypes}
                        />
                        <PromptContainer
                            startAdornment={
                                <>
                                    <Controller
                                        name="files"
                                        control={formContext.control}
                                        rules={{
                                            validate: validateFilesWithOptions,
                                        }}
                                        render={({
                                            // not particularly using hook form anymore
                                            field: {
                                                name,
                                                onBlur,
                                                disabled: _disabled,
                                                onChange: _onChange,
                                                value: _value,
                                                ref: _ref,
                                            },
                                        }) => {
                                            return (
                                                <FileUploadButton
                                                    // not using react-hook-form's ref
                                                    ref={inputRef}
                                                    name={name}
                                                    onBlur={onBlur}
                                                    // isDisabled={disabled}
                                                    // value -- don't think this is useful
                                                    onSelect={(files) => {
                                                        formContext.setValue('files', files, {
                                                            shouldValidate: true,
                                                        });
                                                    }}
                                                    {...fileUploadProps}
                                                />
                                            );
                                        }}
                                    />
                                    {isTranscribing ? <Waveform /> : null}
                                    <AudioInputButton
                                        onTranscriptionBegin={() => {
                                            setTempPlaceholder('Transcribing...');
                                        }}
                                        onRecordingBegin={() => {
                                            setTempPlaceholder('Recording...');
                                        }}
                                        onComplete={() => {
                                            setTempPlaceholder('');
                                        }}
                                        onTranscriptionComplete={(content) => {
                                            const values = formContext.getValues();
                                            formContext.setValue(
                                                'content',
                                                values.content + content
                                            );
                                        }}
                                    />
                                </>
                            }
                            endAdornment={
                                <SubmitPauseAdornment
                                    canPause={canPauseThread}
                                    onPause={onAbort}
                                    isSubmitDisabled={
                                        isSelectedThreadLoading ||
                                        isLimitReached ||
                                        isTranscribing ||
                                        isProcessingAudio ||
                                        !canEditThread
                                    }
                                />
                            }>
                            <Controller
                                control={formContext.control}
                                name="content"
                                rules={{
                                    required: true,
                                    pattern: /[^\s]+/,
                                }}
                                render={({
                                    field: { onChange, value, ref, name },
                                    fieldState: { error },
                                }) => (
                                    <PromptInput
                                        name={name}
                                        onChange={onChange}
                                        errorMessage={error?.message}
                                        value={value}
                                        ref={ref}
                                        onKeyDown={handleKeyDown}
                                        aria-label={placeholderText}
                                        placeholder={tempPlaceholder || placeholderText}
                                        isDisabled={isTranscribing || isProcessingAudio}
                                    />
                                )}
                            />
                        </PromptContainer>
                        {!!formContext.formState.errors.files?.message && (
                            <Typography
                                variant="subtitle2"
                                color={(theme) => theme.palette.error.main}>
                                {formContext.formState.errors.files.message}
                            </Typography>
                        )}
                        {isLimitReached && (
                            <Typography
                                variant="subtitle2"
                                color={(theme) => theme.palette.error.main}>
                                You have reached maximum thread length. Please start a new thread.
                            </Typography>
                        )}
                        {!canEditThread && (
                            <Typography
                                variant="subtitle2"
                                color={(theme) => theme.palette.error.main}>
                                You cannot add a prompt because you are not the thread creator.
                                Please submit your prompt in a new thread.
                            </Typography>
                        )}
                        {process.env.NODE_ENV === 'development' && (
                            <DevTool control={formContext.control} />
                        )}
                    </Stack>
                </FormContainer>
            </QueryFormStyledBox>
        </DropZone>
    );
};
