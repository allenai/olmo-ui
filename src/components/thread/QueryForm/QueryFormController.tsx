import { css } from '@allenai/varnish-panda-runtime/css';
import { DevTool } from '@hookform/devtools';
import { Stack } from '@mui/material';
import mime from 'mime/lite';
import { type KeyboardEvent, type ReactNode, type UIEvent, useEffect, useState } from 'react';
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
import { QueryFormError } from './QueryFormError';
import { QueryFormStyledBox } from './QueryFormStyledBox';
import { SubmitPauseAdornment } from './SubmitPauseAdornment';
import { validateFiles } from './validateFiles';

export interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList | null;
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
    modelSupportsPointingInput?: boolean;
}

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
    modelSupportsPointingInput = true,
}: QueryFormControllerProps): ReactNode => {
    const navigation = useNavigation();
    const getObjectUrl = useObjectUrls();

    const isTranscribing = useAppContext((state) => state.isTranscribing);
    const isProcessingAudio = useAppContext((state) => state.isProcessingAudio);

    const formContext = useForm<QueryFormValues>({
        mode: 'onSubmit',
        defaultValues: {
            content: '',
            private: false,
            files: null,
        },
    });

    const [tempPlaceholder, setTempPlaceholder] = useState('');

    const [fileMimeTypes, setFileMimeTypes] = useState<null | string[]>(null);
    const [loadingMedia, setLoadingMedia] = useState(false);
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
        // Clear the file input element to prevent iOS Safari from holding stale references
        formContext.setValue('files', null);
        setMimeFromFiles(null);
        formContext.reset();
    });

    useEffect(() => {
        if (promptTemplate) {
            formContext.setValue('content', promptTemplate.content);
        }
    }, [formContext, promptTemplate]);

    const setMimeFromFiles = (files: FileList | null) => {
        if (!files) {
            setFileMimeTypes([]);
            return;
        }
        const types: string[] = [];
        for (const file of files) {
            types.push(file.type);
        }
        setFileMimeTypes(types);
    };

    useEffect(() => {
        const loadFiles = async () => {
            if (!areFilesAllowed) {
                formContext.setValue('files', null);
            } else if (promptTemplate?.fileUrls && promptTemplate.fileUrls.length) {
                setLoadingMedia(true);
                formContext.setValue('files', null);
                const quickMimeTypes = promptTemplate.fileUrls
                    .map((m) => mime.getType(m))
                    .filter((x: string | null): x is string => x !== null);

                setFileMimeTypes(quickMimeTypes);
                try {
                    const downloadedFiles = await fetchFilesByUrls([...promptTemplate.fileUrls]);
                    const dataTransfer = new DataTransfer();
                    downloadedFiles.forEach((file) => {
                        dataTransfer.items.add(file);
                    });
                    formContext.setValue('files', dataTransfer.files);
                } catch {
                    // Silently handle error
                }
                setLoadingMedia(false);
            }
        };

        void loadFiles();
    }, [formContext, areFilesAllowed, promptTemplate?.fileUrls]);

    const files = useWatch({ control: formContext.control, name: 'files' });

    // Validation function for file uploads
    const validateFilesWithOptions: Validate<FileList | undefined | null, QueryFormValues> = (
        fileList: FileList | undefined | null
    ): ValidateResult => {
        return validateFiles(fileList, {
            acceptedFileTypes: fileUploadProps.acceptedFileTypes,
            maxFilesPerMessage: fileUploadProps.maxFilesPerMessage,
            canMixFileTypes: false, // shouldn't be static
            maxTotalFileSize: fileUploadProps.maxTotalFileSize,
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

        setMimeFromFiles(dataTransfer.files);
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
            // iOS Safari workaround: react-hook-form's handleSubmit returns stale FileList
            // after reset, but useWatch correctly tracks the value. Use `files` from
            // useWatch instead of data.files.
            await handleSubmit({ ...data, files });
        } catch (e) {
            handleFormSubmitException(e, formContext);
        }
    };

    const _triggerFileSelection = () => {
        // To be used if we have an add another image button
        void formContext.trigger('files');
    };

    const showTrackingInput =
        fileMimeTypes?.length === 1 &&
        fileMimeTypes[0].startsWith('video') &&
        modelSupportsPointingInput;

    const validateContentAndTrackingInput: Validate<string | undefined, QueryFormValues> = (
        content,
        { inputParts }
    ): ValidateResult => {
        if (!inputParts || inputParts.length < 1) {
            if (!content || !content.match(/[^\s]+/)) {
                return `A message ${showTrackingInput ? 'or a tracking point ' : ''}is required.`;
            }
        }
        return true;
    };

    const handleFileSelect = (newFiles: FileList | undefined) => {
        const currentFiles = formContext.getValues('files');

        const dataTransfer = new DataTransfer();

        if (currentFiles) {
            for (const file of currentFiles) {
                dataTransfer.items.add(file);
            }
        }

        if (newFiles) {
            for (const file of newFiles) {
                dataTransfer.items.add(file);
            }
        }

        setMimeFromFiles(dataTransfer.files);
        formContext.setValue('files', dataTransfer.files, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
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
            <QueryFormStyledBox isModal={Boolean(showTrackingInput)}>
                <FormContainer
                    formContext={formContext}
                    onSuccess={handleSubmitController}
                    FormProps={{
                        className: css({
                            display: 'flex',
                            flexDirection: 'column',
                            width: '[100%]',
                        }),
                    }}>
                    {showTrackingInput && (
                        <div
                            className={css({
                                paddingTop: '1',
                                paddingBottom: '3',
                                display: 'flex',
                                flexDirection: 'column',
                                width: '[100%]',
                                minHeight: '[0]',
                            })}>
                            <Controller
                                name="inputParts"
                                control={formContext.control}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <VideoPointingInput
                                            onRemoveFile={() => {
                                                if (files) {
                                                    handleRemoveFile(files[0]);
                                                }
                                            }}
                                            videoUrl={
                                                files && files.length > 0
                                                    ? getObjectUrl(files[0])
                                                    : null
                                            }
                                            userPoint={value ? value[0] : null}
                                            setUserPoint={(point) => {
                                                onChange(point ? [point] : []);
                                            }}
                                        />
                                    );
                                }}
                            />
                        </div>
                    )}
                    <Stack gap={1} alignItems="flex-start" width={1} position="relative">
                        {!showTrackingInput && (
                            <FileUploadThumbnails
                                files={files}
                                onRemoveFile={handleRemoveFile}
                                acceptedFileTypes={fileUploadProps.acceptedFileTypes}
                            />
                        )}
                        <PromptContainer
                            startAdornment={
                                <>
                                    <Controller
                                        name="files"
                                        control={formContext.control}
                                        rules={{
                                            validate: validateFilesWithOptions,
                                        }}
                                        render={({ field: { name, onBlur, ref } }) => (
                                            <FileUploadButton
                                                ref={ref}
                                                onBlur={onBlur}
                                                onSelect={handleFileSelect}
                                                name={name}
                                                {...fileUploadProps}
                                            />
                                        )}
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
                                        !canEditThread ||
                                        loadingMedia
                                    }
                                />
                            }>
                            <Controller
                                control={formContext.control}
                                name="content"
                                rules={{
                                    validate: validateContentAndTrackingInput,
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
                            <QueryFormError>
                                {formContext.formState.errors.files.message}
                            </QueryFormError>
                        )}
                        {isLimitReached && (
                            <QueryFormError>
                                You have reached maximum thread length. Please start a new thread.
                            </QueryFormError>
                        )}
                        {!canEditThread && (
                            <QueryFormError>
                                You cannot add a prompt because you are not the thread creator.
                                Please submit your prompt in a new thread.
                            </QueryFormError>
                        )}
                    </Stack>
                    {process.env.NODE_ENV === 'development' && (
                        <DevTool control={formContext.control} />
                    )}
                </FormContainer>
            </QueryFormStyledBox>
        </DropZone>
    );
};
