import { Grid, IconButton, styled } from '@mui/material';
import { Message, MessagePost } from 'src/api/Message';
import { Check, Clear } from '@mui/icons-material';

import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { useAppContext } from '../../AppContext';

import { MenuWrapperContainer } from '../MessageActionsMenu';
import { RemoteState } from '@/contexts/util';

interface ThreadEditFormProps {
    curMessage: Message;
    handleBranchMenuSelect: (index: number) => void;
    parent?: Message;
    setIsEditing: (isEditing: boolean) => void;
    setMessageLoading: (messageLoading: boolean) => void;
    messagePath?: Message['id'][];
}

export const ThreadEditForm = ({
    curMessage,
    handleBranchMenuSelect,
    parent,
    setIsEditing,
    setMessageLoading,
    messagePath,
}: ThreadEditFormProps) => {
    const curMessageRole = curMessage.role;
    const postMessage = useAppContext((state) => state.postMessage);
    const threadUpdateRemoteState = useAppContext((state) => state.threadUpdateRemoteState);
    const formContext = useForm({
        defaultValues: {
            editMessage: curMessage.content,
        },
    });
    const watchEditMessage = formContext.watch('editMessage');

    const editMessage = async function () {
        setIsEditing(false);
        setMessageLoading(true);
        const payload: MessagePost = {
            content: watchEditMessage,
            role: curMessageRole,
            original: curMessage.id,
        };
        handleBranchMenuSelect(0); // 0 because the new message is unshifted
        await postMessage(payload, parent, false, messagePath);
        if (threadUpdateRemoteState === RemoteState.Loaded) {
            setMessageLoading(false);
        }
    };

    return (
        <FormContainer
            formContext={formContext}
            // Using style instead of styled or sx because rhf-mui doesn't support it well
            FormProps={{ style: { height: '100%' }, 'aria-label': 'Edit LLM response' }}>
            <Grid container spacing={0.5}>
                <Grid item sx={{ flexGrow: 1, marginRight: 2 }}>
                    <TextFieldElement
                        fullWidth
                        multiline
                        name="editMessage"
                        inputProps={{
                            'aria-label': 'Edit Prompt',
                        }}
                    />
                </Grid>
                <Grid item>
                    <MenuWrapperContainer>
                        <OutlinedIconButton
                            sx={{ border: 1, borderRadius: 0, p: 0 }}
                            size="small"
                            disabled={!formContext.formState.isDirty}
                            onClick={editMessage}
                            aria-label="Finish editing LLM response">
                            <Check />
                        </OutlinedIconButton>
                    </MenuWrapperContainer>
                </Grid>
                <Grid item>
                    <MenuWrapperContainer>
                        <OutlinedIconButton
                            sx={{ border: 1, borderRadius: 0, p: 0 }}
                            size="small"
                            onClick={() => setIsEditing(false)}
                            aria-label="Reset changes to LLM response">
                            <Clear />
                        </OutlinedIconButton>
                    </MenuWrapperContainer>
                </Grid>
            </Grid>
        </FormContainer>
    );
};

const OutlinedIconButton = styled(IconButton)`
    &&& {
        border: 1px solid;
        border-radius: 0;
        padding: 0;
    }
`;
