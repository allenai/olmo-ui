import { Grid, IconButton, styled } from '@mui/material';
import { Message, MessagePost } from 'src/api/Message';
import { Check, Clear } from '@mui/icons-material';

import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { useAppContext } from '../../AppContext';

import { MenuWrapperContainer } from '../MessageActionsMenu';

interface ThreadEditFormProps {
    curMessage: Message;
    handleBranchMenuSelect: (index: number) => void;
    parent?: Message;
    setIsEditing: (isEditing: boolean) => void;
    setMessageLoading: (messageLoading: boolean) => void;
}

export const ThreadEditForm = ({
    curMessage,
    handleBranchMenuSelect,
    parent,
    setIsEditing,
    setMessageLoading,
}: ThreadEditFormProps) => {
    const curMessageRole = curMessage.role;
    const postMessage = useAppContext((state) => state.postMessage);
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
            content: watchEditMessage.trim(),
            role: curMessageRole,
            original: curMessage.id,
        };
        handleBranchMenuSelect(0); // 0 because the new message is unshifted
        const postMessageInfo = await postMessage(payload, parent);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            setMessageLoading(false);
        }
    };

    return (
        <FormContainer
            formContext={formContext}
            onSuccess={editMessage}
            // Using style instead of styled or sx because rhf-mui doesn't support it well
            FormProps={{ style: { height: '100%' }, 'aria-label': 'Handle Edit Message' }}>
            <Grid container spacing={0.5}>
                <Grid item sx={{ flexGrow: 1, marginRight: 2 }}>
                    <TextFieldElement fullWidth multiline name="editMessage" />
                </Grid>
                <Grid item>
                    <MenuWrapperContainer>
                        <OutlinedIconButton
                            sx={{ border: 1, borderRadius: 0, p: 0 }}
                            size="small"
                            disabled={!formContext.formState.isDirty}
                            onClick={editMessage}>
                            <Check />
                        </OutlinedIconButton>
                    </MenuWrapperContainer>
                </Grid>
                <Grid item>
                    <MenuWrapperContainer>
                        <OutlinedIconButton
                            sx={{ border: 1, borderRadius: 0, p: 0 }}
                            size="small"
                            onClick={() => setIsEditing(false)}>
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
