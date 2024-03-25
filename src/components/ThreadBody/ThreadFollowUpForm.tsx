import { LinearProgress } from '@mui/material';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import styled from 'styled-components';

import { Message, MessagePost } from '../../api/Message';

import { useAppContext } from '../../AppContext';
import React from 'react';

interface ThreadFollowUpFormProps {
    curMessage: Message;
    disabledActions: boolean;
}

export const ThreadFollowUpForm = ({ curMessage, disabledActions }: ThreadFollowUpFormProps) => {
    const postMessage = useAppContext((state) => state.postMessage);
    const formContext = useForm({
        defaultValues: {
            followUpMessage: '',
        },
    });

    const watchFollowUpMessage = formContext.watch('followUpMessage');

    const postFollowupMessage = async function () {
        const parent = curMessage;
        const payload: MessagePost = {
            content: watchFollowUpMessage || '',
        };
        const postMessageInfo = await postMessage(payload, parent);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            formContext.setValue('followUpMessage', '');
        }
    };

    const handleUserKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            formContext.handleSubmit(postFollowupMessage)();
        }
    }

    return (
        <FollowUpContainer>
            <FormContainer formContext={formContext}>
                <TextFieldElement
                    fullWidth
                    multiline
                    placeholder="Follow Up"
                    disabled={formContext.formState.isSubmitting || disabledActions}
                    onKeyDown={handleUserKeyPress}
                    maxRows={13}
                    name="followUpMessage"
                />
            </FormContainer>
            {formContext.formState.isSubmitting ? <LinearProgress /> : null}
        </FollowUpContainer>
    );
};

const FollowUpContainer = styled.div`
    padding-left: ${({ theme }) => theme.spacing(2)};
    padding-right: ${({ theme }) => theme.spacing(1)};
    margin: ${({ theme }) => theme.spacing(2)};
`;
