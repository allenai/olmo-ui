import {
    ContentCopy,
    Flag,
    FlagOutlined,
    ThumbDown,
    ThumbDownOutlined,
    ThumbUp,
    ThumbUpOutlined,
} from '@mui/icons-material';
import { ButtonGroup, Snackbar, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Label, LabelRating } from '@/api/Label';
import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { ResponsiveButton } from './ResponsiveButton';

interface MessageInteractionProps {
    role: Message['role'];
    messageLabels: Message['labels'];
    content: Message['content'];
    messageId: Message['id'];
}

export const MessageInteraction = ({
    role,
    messageLabels,
    content,
    messageId,
}: MessageInteractionProps): JSX.Element | null => {
    const userInfo = useAppContext((state) => state.userInfo);
    const updateLabel = useAppContext((state) => state.updateLabel);
    const isUpdatingLLMMessage = useAppContext(
        (state) =>
            state.streamingMessageId === messageId &&
            state.streamPromptState === RemoteState.Loading
    );
    // Filter out the label that was rated by the current login user then pop the first one
    // A response should have at most 1 label from the current login user
    const [currentLabel, setCurrentLabel] = useState<Label | undefined>(
        messageLabels.filter((label) => label.creator === userInfo?.client).pop()
    );
    const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

    const GoodIcon = currentLabel?.rating === LabelRating.Positive ? ThumbUp : ThumbUpOutlined;
    const BadIcon = currentLabel?.rating === LabelRating.Negative ? ThumbDown : ThumbDownOutlined;
    const FlagIcon = currentLabel?.rating === LabelRating.Flag ? Flag : FlagOutlined;

    const rateMessage = (newRating: LabelRating) => {
        updateLabel({ rating: newRating, message: messageId }, currentLabel).then((newLabel) => {
            setCurrentLabel(newLabel);
        });
    };

    const copyMessage = useCallback(() => {
        navigator.clipboard.writeText(content);
        setCopySnackbarOpen(true);
    }, [content]);

    if (role === Role.User || isUpdatingLLMMessage) {
        return null;
    }

    return (
        <Stack direction="row" gap={2} alignItems="start">
            <FeedbackButtonGroup variant="outlined" aria-label="Thread feedback buttons">
                <ResponsiveButton
                    variant="outlined"
                    startIcon={<GoodIcon />}
                    title="Good"
                    onClick={() => {
                        rateMessage(LabelRating.Positive);
                    }}
                    aria-pressed={currentLabel?.rating === LabelRating.Positive}
                />
                <ResponsiveButton
                    variant="outlined"
                    startIcon={<BadIcon />}
                    title="Bad"
                    onClick={() => {
                        rateMessage(LabelRating.Negative);
                    }}
                    aria-pressed={currentLabel?.rating === LabelRating.Negative}
                />
                <ResponsiveButton
                    variant="outlined"
                    startIcon={<FlagIcon />}
                    title="Inappropriate"
                    onClick={() => {
                        rateMessage(LabelRating.Flag);
                    }}
                    aria-pressed={currentLabel?.rating === LabelRating.Flag}
                />
            </FeedbackButtonGroup>
            <ResponsiveButton
                variant="outlined"
                startIcon={<ContentCopy />}
                title="Copy"
                onClick={copyMessage}
            />
            <Snackbar // TODO: convert to using AlertSlice once PR #396 gets merged.
                open={copySnackbarOpen}
                autoHideDuration={500}
                onClose={() => {
                    setCopySnackbarOpen(false);
                }}
                message="LLM Response Copied."
            />
        </Stack>
    );
};

const FeedbackButtonGroup = styled(ButtonGroup)`
    && {
        margin-left: ${({ theme }) => theme.spacing(4.5)};
    }
`;
