import { Button, Stack } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import { useAppContext } from '@/AppContext';
import { MessagePost } from '@/api/Message';
import { useNewQueryFormHandling } from '../NewQuery/NewQueryForm';
import { getSelectedMessagesToShow } from './ThreadDisplay';

interface QueryFormProps {
    onSubmit: (data: { content: string; parent?: string }) => Promise<void> | void;
    variant: 'new' | 'response';
}

export const QueryForm = ({ onSubmit, variant }: QueryFormProps): JSX.Element => {
    // TODO: Refactor this to not use model stuff
    const formContext = useNewQueryFormHandling();

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
                />
                <Button type="submit" variant="contained" data-testid="Submit Prompt Button">
                    Submit
                </Button>
            </Stack>
        </FormContainer>
    );
};
