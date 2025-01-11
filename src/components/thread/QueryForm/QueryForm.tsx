import Send from '@mui/icons-material/Send';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import {
    Box,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    svgIconClasses,
    Typography,
} from '@mui/material';
import React, { ComponentProps, PropsWithChildren, UIEvent, useCallback, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Controller, FormContainer, useForm } from 'react-hook-form-mui';
import { useLocation, useNavigation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { StreamBadRequestError } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { getFAQIdByShortId } from '@/components/faq/faq-utils';
import { selectMessagesToShow } from '@/components/thread/ThreadDisplay/selectMessagesToShow';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import { PromptInput } from './PromptInput';

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
            size="medium"
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
        <InputAdornment position="end" sx={{ color: 'secondary.main', height: 'auto' }}>
            {canPause ? (
                <QueryFormButton
                    aria-label="Stop response generation"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === 'Space') {
                            event.preventDefault();
                            event.stopPropagation();
                            onPause(event);
                        }
                    }}
                    onClick={(event) => {
                        onPause(event);
                    }}>
                    <StopCircleOutlinedIcon />
                </QueryFormButton>
            ) : (
                <QueryFormButton
                    type="submit"
                    aria-label="Submit prompt"
                    disabled={isSubmitDisabled}>
                    <Send />
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

    const { executeRecaptcha } = useGoogleReCaptcha();

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

    const handleSubmit = async (data: { content: string }) => {
        if (!canEditThread || isSelectedThreadLoading) {
            return;
        }

        // TODO: Make sure executeRecaptcha is present when we require recaptchas
        const token =
            process.env.IS_RECAPTCHA_ENABLED === 'true'
                ? await executeRecaptcha?.('prompt_submission')
                : undefined;

        const request: StreamMessageRequest = { ...data, captchaToken: token };

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

    return (
        <Box marginBlockStart="auto" width={1} paddingInline={2}>
            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                <Stack gap={1} alignItems="flex-start" width={1}>
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
                                errorMessage={
                                    error?.type === 'inappropriate' ? (
                                        <>
                                            This prompt was flagged as inappropriate. Please change
                                            your prompt and resubmit.{' '}
                                            <Link
                                                href={
                                                    links.faqs +
                                                    getFAQIdByShortId('wildguard-intro')
                                                }>
                                                Learn why
                                            </Link>
                                        </>
                                    ) : null
                                }
                                value={value}
                                ref={ref}
                                onKeyDown={handleKeyDown}
                                aria-label={placeholderText}
                                placeholder={placeholderText}
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
