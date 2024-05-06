import { LinearProgress } from '@mui/material';
import React from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import styled from 'styled-components';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { Message, MessagePost } from '../../api/Message';
import { useAppContext } from '../../AppContext';

interface ThreadFollowUpFormProps {
    curMessage: Message;
    disabledActions: boolean;
    messagePath?: Message['id'][];
}

export const ThreadFollowUpForm = ({
    curMessage,
    disabledActions,
    messagePath,
}: ThreadFollowUpFormProps) => {
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
        const postMessageInfo = await postMessage(payload, parent, false, messagePath);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            analyticsClient.trackFollowUpPrompt({
                threadId: postMessageInfo.data.root,
            });
            formContext.setValue('followUpMessage', '');
        }
    };

    const handleUserKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            formContext.handleSubmit(postFollowupMessage)();
        }
    };

    return (
        <FollowUpContainer>
            <FormContainer
                formContext={formContext}
                FormProps={{ style: { height: '100%' }, 'aria-label': 'Follow Up Prompt' }}>
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
