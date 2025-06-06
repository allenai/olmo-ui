import { Box, Stack, Typography } from '@mui/material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import React, { JSX, UIEvent, useCallback, useEffect } from 'react';
import {
    Controller,
    FormContainer,
    SubmitHandler,
    useForm,
    type UseFormReturn,
} from 'react-hook-form-mui';
import { useLocation, useNavigation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { StreamBadRequestError, StreamValidationError } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';
import { useImageProcessing } from '@/utils/imageUtils';

import { FileUploadButton } from './FileUploadButton';
import { FileUploadThumbnails } from './FileUploadThumbnails/FileThumbnailDisplay';
import { PromptInput } from './PromptInput';
import { SubmitPauseAdornment } from './SubmitPauseAdornment';

interface QueryFormValues {
    content: string;
    private: boolean;
    files?: FileList;
}

const handleFormSubmitException = (e: unknown, formContext: UseFormReturn<QueryFormValues>) => {
    if (e instanceof StreamBadRequestError) {
        if (e instanceof StreamValidationError) {
            formContext.setError('content', {
                type: 'validation',
                message: e.description,
            });
        }

        switch (e.description) {
            case 'inappropriate_prompt_text':
            case 'inappropriate_prompt': // fallthrough
                formContext.setError('content', {
                    type: 'inappropriate',
                    message:
                        'This prompt text was flagged as inappropriate. Please change your prompt text and resubmit.',
                });
                analyticsClient.trackInappropriatePrompt('text');
                return;

            case 'inappropriate_prompt_file':
                formContext.setError('content', {
                    type: 'inappropriate',
                    message:
                        'The submitted image was flagged as inappropriate. Please change your image and resubmit.',
                });
                analyticsClient.trackInappropriatePrompt('file');
                return;

            case 'invalid_captcha':
                formContext.setError('content', {
                    type: 'recaptcha',
                    message:
                        'We were unable to verify your request. Please reload the page and try again.',
                });
                return;

            case 'failed_captcha_assessment':
                formContext.setError('content', {
                    type: 'recaptcha',
                    message:
                        'Our systems have detected unusual traffic. Please log in to send new messages.',
                });
                return;

            default:
                throw e;
        }
    } else {
        throw e;
    }
};

export const QueryForm = (): JSX.Element => {
    const navigation = useNavigation();
    const location = useLocation();
    const streamPrompt = useAppContext((state) => state.streamPrompt);
    const firstResponseId = useAppContext((state) => state.streamingMessageId);
    const selectedModel = useAppContext((state) => state.selectedModel);

    const { executeRecaptcha } = useReCaptcha();

    const formContext = useForm<QueryFormValues>({
        defaultValues: {
            content: '',
            private: false,
            files: undefined,
        },
    });

    const canEditThread = useAppContext((state) => {
        // check for new thread & thread creator
        return (
            state.selectedThreadRootId === '' ||
            state.selectedThreadMessagesById[state.selectedThreadRootId].creator ===
                state.userInfo?.client
        );
    });

    const abortPrompt = useAppContext((state) => state.abortPrompt);
    const canPauseThread = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading && state.abortController != null
    );

    const onAbort = useCallback(
        (event: UIEvent) => {
            event.preventDefault();
            abortPrompt();
        },
        [abortPrompt]
    );

    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const isLimitReached = useAppContext((state) => {
        // We check if any of the messages in the current branch that reach the max length limit. Notice that max length limit happens on the branch scope. Users can create a new branch in the current thread and TogetherAI would respond until reaching another limit.
        return viewingMessageIds.some(
            (messageId) => state.selectedThreadMessagesById[messageId].isLimitReached
        );
    });

    const isSelectedThreadLoading = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading
    );

    const lastMessageId =
        viewingMessageIds.length > 0 ? viewingMessageIds[viewingMessageIds.length - 1] : undefined;

    // Autofocus the input if we're on a new thread
    useEffect(() => {
        if (location.pathname === links.playground) {
            formContext.setFocus('content');
        }
    }, [location.pathname, formContext]);

    // Clear errors when we navigate between pages
    useEffect(() => {
        if (navigation.state === 'loading') {
            formContext.clearErrors();
        }
    }, [formContext, navigation.state]);

    // Clear form input after the client receive the first message
    useEffect(() => {
        if (firstResponseId !== null) {
            formContext.reset();
        }
    }, [firstResponseId, formContext]);

    useEffect(() => {
        if (!selectedModel?.accepts_files) {
            formContext.setValue('files', undefined);
        }
    }, [formContext, selectedModel?.accepts_files]);

    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
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

        const request: StreamMessageRequest = { ...data, captchaToken: token };

        if (lastMessageId != null) {
            request.parent = lastMessageId;
        }

        try {
            await streamPrompt(request);
            if (selectedModel !== undefined) {
                analyticsClient.trackQueryFormSubmission(
                    selectedModel.id,
                    location.pathname === links.playground
                );
            }
        } catch (e) {
            handleFormSubmitException(e, formContext);
        }
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await formContext.handleSubmit(handleSubmit)();
        }
    };

    const placeholderText = useAppContext((state) => {
        const selectedModelFamilyName = state.selectedModel?.family_name ?? 'the model';
        // since selectedThreadRootId's empty state is an empty string we just check for truthiness
        const isReply = state.selectedThreadRootId;

        const familyNamePrefix = isReply ? 'Reply to' : 'Message';

        return `${familyNamePrefix} ${selectedModelFamilyName}`;
    });

    const files = formContext.watch('files');

    // Process and resize images when files change
    useImageProcessing(files, formContext);

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

    return (
        <Box marginBlockStart="auto" width={1} paddingInline={2}>
            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
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
                                placeholder={placeholderText}
                                startAdornment={
                                    <FileUploadButton {...formContext.register('files')} />
                                }
                                endAdornment={
                                    <SubmitPauseAdornment
                                        canPause={canPauseThread}
                                        onPause={onAbort}
                                        isSubmitDisabled={
                                            isSelectedThreadLoading ||
                                            isLimitReached ||
                                            !canEditThread
                                        }
                                    />
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
