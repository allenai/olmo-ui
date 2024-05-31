import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { MessagePost } from '@/api/Message';
import { useAppContext } from '@/AppContext';

import { getSelectedMessagesToShow } from './ThreadDisplay';

interface QueryFormProps {
    onSubmit: (data: { content: string; parent?: string }) => Promise<void> | void;
    variant: 'new' | 'response';
}

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
        if (models.length > 0) {
            formContext.reset({ model: models[0].id });
        }
    }, [models]);
    return formContext;
};

export const QueryForm = ({ onSubmit }: QueryFormProps): JSX.Element => {
    // TODO: Refactor this to not use model stuff
    const formContext = useNewQueryFormHandling();
    const canEditThread = useAppContext((state) =>
        state.selectedThreadInfo.data
            ? state.selectedThreadInfo.data.creator === state.userInfo?.client &&
              state.selectedThreadRootId.length !== 0
            : true
    );

    const abortController = useAppContext((state) => state.abortController);
    const canPauseThread = useAppContext(
        (state) =>
            !!abortController && !!state.streamingMessageId && !!state.postMessageInfo.loading
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

    const isSelectedThreadLoading = useAppContext((state) => state.postMessageInfo.loading);

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

        await onSubmit(request);
        formContext.reset();
    };

    return (
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
                    required
                    validation={{ pattern: /[^\s]+/ }}
                    // If we don't have a dense margin the label gets cut off!
                    margin="dense"
                    disabled={!canEditThread}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {canPauseThread ? (
                                    <IconButton data-testid="Pause Thread" onClick={onAbort}>
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
            </Stack>
        </FormContainer>
    );
};
