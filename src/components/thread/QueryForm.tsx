import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { Box, IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useLocation } from 'react-router-dom';

import { MessagePost, StreamBadRequestError } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';

import { getSelectedMessagesToShow } from './ThreadDisplay';

const useNewQueryFormHandling = () => {
    const models = useAppContext((state) => state.models);

    const formContext = useForm({
        defaultValues: {
            model: models.length > 0 ? models[0].id : '',
            content: '',
            private: false,
        },
    });

    useEffect(() => {
        if (models.length > 0 && !formContext.formState.isDirty) {
            formContext.reset({ model: models[0].id });
        }
    }, [formContext, models]);
    return formContext;
};

export const QueryForm = (): JSX.Element => {
    const streamPrompt = useAppContext((state) => state.streamPrompt);

    const handlePromptSubmission = async (data: { content: string; parent?: string }) => {
        await streamPrompt(data);
    };

    // TODO: Refactor this to not use model stuff
    const formContext = useNewQueryFormHandling();
    const location = useLocation();

    const canEditThread = useAppContext((state) => {
        // check for new thread & thread creator
        return (
            state.selectedThreadRootId === '' ||
            state.selectedThreadMessagesById[state.selectedThreadRootId].creator ===
                state.userInfo?.client
        );
    });

    const abortController = useAppContext((state) => state.abortController);
    const canPauseThread = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading && abortController != null
    );

    const onAbort = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            abortController?.abort();
        },
        [abortController]
    );

    const isLimitReached = useAppContext((state) => {
        // We check if any of the messages in the current branch that reach the max length limit. Notice that max length limit happens on the branch scope. Users can create a new branch in the current thread and TogetherAI would respond until reaching another limit.
        const viewingMessageIds = getSelectedMessagesToShow(state);
        const isLimitReached = viewingMessageIds.some(
            (messageId) => state.selectedThreadMessagesById[messageId].isLimitReached
        );

        return isLimitReached;
    });

    const isSelectedThreadLoading = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading
    );

    const lastMessageId = useAppContext((state) => {
        const messagesToShow = getSelectedMessagesToShow(state);

        if (messagesToShow.length === 0) {
            return undefined;
        }

        const lastMessage = messagesToShow[messagesToShow.length - 1];
        return lastMessage;
    });

    const handleSubmit = async (data: { content: string }) => {
        const request: MessagePost = { ...data };

        if (lastMessageId != null) {
            request.parent = lastMessageId;
        }

        try {
            await handlePromptSubmission(request);
            formContext.reset();
        } catch (e) {
            if (e instanceof StreamBadRequestError) {
                formContext.setError('content', {
                    type: 'inappropriate',
                });
            }
        }
    };

    const handleOnKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await formContext.handleSubmit(handleSubmit)();
        }
    };

    useEffect(() => {
        if (location.pathname === links.playground) {
            formContext.setFocus('content');
        }
    }, [location.pathname, formContext]);

    return (
        <Box marginBlockStart="auto" width={1}>
            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                <Stack gap={1.5} alignItems="flex-start">
                    <TextFieldElement
                        name="content"
                        label="Prompt"
                        placeholder="Enter your prompt here"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        multiline
                        required
                        parseError={(error) => {
                            if (error.type === 'inappropriate') {
                                return (
                                    <>
                                        This prompt was flagged as inappropriate. Please change your
                                        prompt and resubmit.{' '}
                                        <Link href={links.faqs} target="_blank" rel="noreferrer">
                                            Learn why
                                        </Link>
                                    </>
                                );
                            }

                            return error.message;
                        }}
                        validation={{ pattern: /[^\s]+/ }}
                        // If we don't have a dense margin the label gets cut off!
                        margin="dense"
                        disabled={!canEditThread}
                        onKeyDown={handleOnKeyDown}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {canPauseThread ? (
                                        <IconButton
                                            data-testid="Pause Thread"
                                            onClick={(event) => {
                                                onAbort(event);
                                            }}>
                                            <StopCircleOutlinedIcon fontSize="large" />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            type="submit"
                                            data-testid="Submit Prompt Button"
                                            disabled={
                                                isSelectedThreadLoading ||
                                                isLimitReached ||
                                                !canEditThread
                                            }>
                                            <ArrowCircleUpIcon fontSize="large" />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Stack direction="row" gap={2} alignItems="center">
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
                    </Stack>
                </Stack>
            </FormContainer>
        </Box>
    );
};
