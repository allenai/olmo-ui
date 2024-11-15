import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import {
    Box,
    IconButton,
    InputAdornment,
    Link,
    outlinedInputClasses,
    Stack,
    svgIconClasses,
    Typography,
} from '@mui/material';
import React, { ComponentProps, PropsWithChildren, UIEvent, useCallback, useEffect } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useLocation, useNavigation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { MessagePost, StreamBadRequestError } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';

import { getFAQIdByShortId } from '../faq/faq-utils';

interface QueryFormButtonProps
    extends PropsWithChildren,
        Pick<
            ComponentProps<typeof IconButton>,
            'type' | 'aria-label' | 'children' | 'disabled' | 'onKeyDown' | 'onClick'
        > {}

const QueryFormButton = ({
    children,
    type,
    'aria-label': ariaLabel,
    disabled,
    onClick,
    onKeyDown,
}: QueryFormButtonProps) => {
    return (
        <IconButton
            type={type}
            aria-label={ariaLabel}
            color="inherit"
            edge="end"
            disableRipple
            sx={(theme) => ({
                paddingInlineEnd: 2,
                '&:hover': {
                    color: theme.color['teal-100'].hex,
                },
                [`&.Mui-focusVisible .${svgIconClasses.root}`]: {
                    outline: `1px solid`,
                    borderRadius: '50%',
                },
            })}
            disabled={disabled}
            onClick={onClick}
            onKeyDown={onKeyDown}>
            {children}
        </IconButton>
    );
};

interface SubmitPauseAdornmentProps {
    canPause?: boolean;
    onPause: (event: UIEvent) => void;
    isSubmitDisabled?: boolean;
}

const SubmitPauseAdornment = ({
    canPause,
    onPause,
    isSubmitDisabled,
}: SubmitPauseAdornmentProps) => {
    return (
        <InputAdornment position="end" sx={{ color: 'text.primary' }}>
            {canPause ? (
                <QueryFormButton
                    aria-label="Stop response generation"
                    onKeyDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onPause(event);
                    }}
                    onClick={(event) => {
                        onPause(event);
                    }}>
                    <StopCircleOutlinedIcon fontSize="large" />
                </QueryFormButton>
            ) : (
                <QueryFormButton
                    type="submit"
                    aria-label="Submit prompt"
                    disabled={isSubmitDisabled}>
                    <ArrowCircleUpIcon fontSize="large" />
                </QueryFormButton>
            )}
        </InputAdornment>
    );
};

export const QueryForm = (): JSX.Element => {
    const navigation = useNavigation();
    const location = useLocation();
    const streamPrompt = useAppContext((state) => state.streamPrompt);
    const firstResponseId = useAppContext((state) => state.streamingMessageId);
    const formContext = useForm({
        defaultValues: {
            content: '',
            private: false,
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

    const abortController = useAppContext((state) => state.abortController);
    const canPauseThread = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading && abortController != null
    );

    const onAbort = useCallback(
        (event: UIEvent) => {
            event.preventDefault();
            abortController?.abort();
        },
        [abortController]
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
        formContext.reset();
    }, [firstResponseId, formContext]);

    const handleSubmit = async (data: { content: string }) => {
        const request: MessagePost = { ...data };

        if (lastMessageId != null) {
            request.parent = lastMessageId;
        }

        try {
            await streamPrompt(request);
        } catch (e) {
            if (e instanceof StreamBadRequestError && e.description === 'inappropriate_prompt') {
                formContext.setError('content', {
                    type: 'inappropriate',
                });
            } else {
                throw e;
            }
        }
    };

    const handleOnKeyDown = async (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await formContext.handleSubmit(handleSubmit)();
        }
    };

    return (
        <Box marginBlockStart="auto" width={1}>
            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                <Stack gap={1.5} alignItems="flex-start">
                    <TextFieldElement
                        name="content"
                        label="Prompt"
                        placeholder="Enter prompt"
                        InputLabelProps={{
                            shrink: true,
                            // This gets rid of the * by the label
                            required: false,
                            // @ts-expect-error - text is valid but isn't typed
                            color: 'text',
                        }}
                        fullWidth
                        required
                        parseError={(error) => {
                            if (error.type === 'inappropriate') {
                                return (
                                    <>
                                        This prompt was flagged as inappropriate. Please change your
                                        prompt and resubmit.{' '}
                                        <Link
                                            href={
                                                links.faqs + getFAQIdByShortId('wildguard-intro')
                                            }>
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
                        disabled={!canEditThread || isSelectedThreadLoading}
                        onKeyDown={handleOnKeyDown}
                        InputProps={{
                            sx: (theme) => ({
                                [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                                    borderColor: theme.palette.text.primary,
                                },
                            }),
                            endAdornment: (
                                <SubmitPauseAdornment
                                    canPause={canPauseThread}
                                    onPause={onAbort}
                                    isSubmitDisabled={
                                        isSelectedThreadLoading || isLimitReached || !canEditThread
                                    }
                                />
                            ),
                            maxRows: 5,
                            multiline: true,
                            inputComponent: 'textarea',
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
