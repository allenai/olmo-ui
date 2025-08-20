import { Box, Stack, Typography } from '@mui/material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import { KeyboardEvent, UIEvent, useEffect, useState } from 'react';
import { Controller, FormContainer, SubmitHandler, useForm } from 'react-hook-form-mui';
import { useNavigation } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { AudioInputButton } from './AudioTranscription/AudioInputButton';
import { Waveform } from './AudioTranscription/Waveform';
import { FileUploadButton, FileuploadPropsBase } from './FileUploadButton';
import { FileUploadThumbnails } from './FileUploadThumbnails/FileThumbnailDisplay';
import { handleFormSubmitException } from './handleFormSubmitException';
import { PromptInput } from './PromptInput';
import { SubmitPauseAdornment } from './SubmitPauseAdornment';

export interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
    // This isn't part of the form data explicitly, but is added in the submit handler
    captchaToken?: string | null;
}

interface QueryFormControllerProps {
    handleSubmit: SubmitHandler<QueryFormValues>;
    canEditThread: boolean;
    placeholderText: string;
    autofocus: boolean;
    areFilesAllowed: boolean;
    onAbort: (e: UIEvent) => void;
    canPauseThread: boolean;
    isLimitReached: boolean;
    remoteState?: RemoteState;
    shouldResetForm?: boolean;
    fileUploadProps: FileuploadPropsBase;
}

export const QueryFormController = ({
    handleSubmit,
    // props
    canEditThread,
    placeholderText,
    autofocus,
    areFilesAllowed,
    onAbort,
    canPauseThread,
    isLimitReached,
    remoteState,
    shouldResetForm,
    fileUploadProps,
}: QueryFormControllerProps) => {
    const navigation = useNavigation();

    const isTranscribing = useAppContext((state) => state.isTranscribing);
    const isProcessingAudio = useAppContext((state) => state.isProcessingAudio);

    const { executeRecaptcha } = useReCaptcha();

    const formContext = useForm<QueryFormValues>({
        defaultValues: {
            content: '',
            private: false,
            files: undefined,
        },
    });

    const [placeholderValue, setPlaceholderValue] = useState(placeholderText);

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

    // Clear form input after the client receive the first message(s)
    useEffect(() => {
        if (shouldResetForm) {
            formContext.reset();
        }
    }, [shouldResetForm, formContext]);

    useEffect(() => {
        if (!areFilesAllowed) {
            formContext.setValue('files', undefined);
        }
    }, [formContext, areFilesAllowed]);

    const files = formContext.watch('files');

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

        formContext.setValue('files', dataTransfer.files);
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
        const isReCaptchaEnabled = process.env.IS_RECAPTCHA_ENABLED;

        if (isReCaptchaEnabled === 'true' && executeRecaptcha == null) {
            analyticsClient.trackCaptchaNotLoaded();
        }

        // TODO: Make sure executeRecaptcha is present when we require recaptchas
        const token =
            isReCaptchaEnabled === 'true'
                ? await executeRecaptcha?.('prompt_submission')
                : undefined;

        try {
            await handleSubmit({ ...data, captchaToken: token });
        } catch (e) {
            handleFormSubmitException(e, formContext);
        }
    };

    return (
        <Box marginBlockStart="auto" width={1} paddingInline={2}>
            <FormContainer formContext={formContext} onSuccess={handleSubmitController}>
                <Stack gap={1} alignItems="flex-start" width={1} position="relative">
                    <FileUploadThumbnails files={files} onRemoveFile={handleRemoveFile} />
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
                                placeholder={placeholderValue}
                                isDisabled={isTranscribing || isProcessingAudio}
                                startAdornment={
                                    <>
                                        <AudioInputButton
                                            onTranscriptionBegin={() => {
                                                setPlaceholderValue('Transcribing...');
                                            }}
                                            onRecordingBegin={() => {
                                                setPlaceholderValue('Recording...');
                                            }}
                                            onComplete={() => {
                                                setPlaceholderValue(placeholderText);
                                            }}
                                            onTranscriptionComplete={(content) => {
                                                const values = formContext.getValues();
                                                formContext.setValue(
                                                    'content',
                                                    values.content + content
                                                );
                                            }}
                                        />
                                        <FileUploadButton
                                            {...formContext.register('files')}
                                            {...fileUploadProps}
                                        />
                                    </>
                                }
                                endAdornment={
                                    <>
                                        {isTranscribing ? <Waveform /> : null}
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
                                    </>
                                }
                            />
                        )}
                    />
                    {isLimitReached && (
                        <Typography variant="subtitle2" color={(theme) => theme.palette.error.main}>
                            You have reached maximum thread length. Please start a new thread.
                        </Typography>
                    )}
                    {!canEditThread && (
                        <Typography variant="subtitle2" color={(theme) => theme.palette.error.main}>
                            You cannot add a prompt because you are not the thread creator. Please
                            submit your prompt in a new thread.
                        </Typography>
                    )}
                </Stack>
            </FormContainer>
        </Box>
    );
};
