import { Button, ButtonGroup, Stack, Typography } from '@mui/material';
import {
    ContentCopy,
    ThumbUp,
    ThumbUpOutlined,
    ThumbDown,
    ThumbDownOutlined,
    Flag,
    FlagOutlined,
} from '@mui/icons-material';
import styled from 'styled-components';
import { useCallback } from 'react';

import { LabelRating } from '@/api/Label';
import { Message } from '@/api/Message';
import { RemoteState } from '@/contexts/util';
import { useAppContext } from '@/AppContext';
import { Role } from '@/api/Role';

interface MessageInteractionProps {
    message: Message;
}

export const MessageInteraction = ({ message }: MessageInteractionProps): JSX.Element | null => {
    if (message.role === Role.User) {
        return null;
    }

    const userInfo = useAppContext((state) => state.userInfo);
    const postLabel = useAppContext((state) => state.postLabel);
    const deleteLabel = useAppContext((state) => state.deleteLabel);
    const labelRemoteState = useAppContext((state) => state.labelRemoteState);
    // Filter out the labels that was rated by the current login user then pop the first one
    // A response should have at most 1 label from the current login user
    const currentMessageLabel = message.labels.filter((_) => _.creator === userInfo?.client).pop();

    const GoodIcon =
        currentMessageLabel?.rating === LabelRating.Positive ? ThumbUp : ThumbUpOutlined;
    const BadIcon =
        currentMessageLabel?.rating === LabelRating.Negative ? ThumbDown : ThumbDownOutlined;
    const FlagIcon = currentMessageLabel?.rating === LabelRating.Flag ? Flag : FlagOutlined;

    const rateMessage = async (newRating: LabelRating) => {
        const continueAfterDelete = currentMessageLabel?.rating !== newRating;
        if (currentMessageLabel !== undefined) {
            await deleteLabel(currentMessageLabel.id, message);
        }

        if (continueAfterDelete) {
            postLabel({ rating: newRating, message: message.id }, message);
        }
    };

    const copyMessage = useCallback(() => {}, []);

    return (
        <Stack direction="row" gap={2} alignItems="start">
            <FeedbackButtonGroup
                variant="outlined"
                aria-label="Thread feedback buttons"
                disabled={labelRemoteState === RemoteState.Loading}>
                <ActionButton
                    startIcon={<GoodIcon />}
                    onClick={() => rateMessage(LabelRating.Positive)}>
                    <Typography>Good</Typography>
                </ActionButton>
                <ActionButton
                    startIcon={<BadIcon />}
                    onClick={() => rateMessage(LabelRating.Negative)}>
                    <Typography>Bad</Typography>
                </ActionButton>
                <ActionButton
                    startIcon={<FlagIcon />}
                    onClick={() => rateMessage(LabelRating.Flag)}>
                    <Typography>Inappropriate</Typography>
                </ActionButton>
            </FeedbackButtonGroup>
            <ActionButton variant="outlined" startIcon={<ContentCopy />} onClick={copyMessage}>
                <Typography>Copy</Typography>
            </ActionButton>
        </Stack>
    );
};

const ActionButton = styled(Button)`
    && {
        border-color: ${({ theme }) => theme.color.B6.hex};
        color: ${({ theme }) => theme.color.B6.hex};
    }
`;

const FeedbackButtonGroup = styled(ButtonGroup)`
    && {
        margin-left: ${({ theme }) => theme.spacing(4.5)};
    }
`;
