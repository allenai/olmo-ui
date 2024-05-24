import { Button, Stack, Typography } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import { MessagePost } from '@/api/Message';
import { useAppContext } from '@/AppContext';

import { useNewQueryFormHandling } from '../NewQuery/NewQueryForm';
import { getSelectedMessagesToShow } from './ThreadDisplay';

interface QueryFormProps {
    onSubmit: (data: { content: string; parent?: string }) => Promise<void> | void;
    variant: 'new' | 'response';
}

export const QueryForm = ({ onSubmit, variant }: QueryFormProps): JSX.Element => {
    // TODO: Refactor this to not use model stuff
    const formContext = useNewQueryFormHandling();
    const selectedThreadRootId = useAppContext((state) => state.selectedThreadRootId);
    const canEditThread = useAppContext(
        (state) => state.selectedThreadInfo.data?.creator === state.userInfo?.client
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
                    multiline
                    minRows={variant === 'new' ? 6 : 4}
                    // If we don't have a dense margin the label gets cut off!
                    margin="dense"
                    disabled={selectedThreadRootId.length !== 0 && !canEditThread}
                />
                <Stack direction="row" gap={2} alignItems="center">
                    <Button
                        type="submit"
                        variant="contained"
                        data-testid="Submit Prompt Button"
                        disabled={
                            isSelectedThreadLoading ||
                            isLimitReached ||
                            (selectedThreadRootId.length !== 0 && !canEditThread)
                        }>
                        Submit
                    </Button>
                    {isLimitReached && (
                        <Typography variant="subtitle2" color={(theme) => theme.palette.error.main}>
                            You have reached maximum thread length. Please start a new thread.
                        </Typography>
                    )}
                    {selectedThreadRootId.length !== 0 && !canEditThread && (
                        <Typography variant="subtitle2" color={(theme) => theme.palette.error.main}>
                            You cannot add new messages to this thread because you&apos;re not the
                            creator. To send messages, please create a new thread.
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </FormContainer>
    );
};
