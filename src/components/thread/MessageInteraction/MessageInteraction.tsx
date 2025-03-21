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

import { Label, LabelRating } from '@/api/Label';
import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { RemoteState } from '@/contexts/util';

import { CHAT_MESSAGE_CLASS_NAME } from '../ChatMessage/ChatMessage';
import { MessageInteractionIcon } from './MessageInteractionIcon';
import { SelectMessageButton } from './SelectMessageButton';

interface MessageInteractionProps {
    role: Message['role'];
    messageLabels: Message['labels'];
    content: Message['content'];
    messageId: Message['id'];
    autoHideControls: boolean;
}

export const MessageInteraction = ({
    role,
    messageLabels,
    content,
    messageId,
    autoHideControls,
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

    const rateMessage = async (newRating: LabelRating) => {
        await updateLabel({ rating: newRating, message: messageId }, currentLabel).then(
            (newLabel) => {
                setCurrentLabel(newLabel);
            }
        );
    };

    const copyMessage = useCallback(async () => {
        await navigator.clipboard.writeText(content);
        setCopySnackbarOpen(true);
    }, [content]);

    if (role === Role.User || isUpdatingLLMMessage) {
        return null;
    }

    return (
        <Stack
            direction="row"
            gap={0}
            alignItems="start"
            sx={(theme) => ({
                '@media (pointer: fine)': {
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        opacity: autoHideControls ? 0 : 1,
                        transition: 'opacity 300ms linear',
                        [`.${CHAT_MESSAGE_CLASS_NAME}:hover &, .${CHAT_MESSAGE_CLASS_NAME}:focus-within &`]:
                        {
                            opacity: 1,
                            transitionDelay: '0s',
                        },
                    },
                },
            })}>
            <ButtonGroup aria-label="Thread feedback buttons">
                <MessageInteractionIcon
                    tooltip="Good response"
                    Icon={GoodIcon}
                    selected={currentLabel?.rating === LabelRating.Positive}
                    onClick={async () => {
                        await rateMessage(LabelRating.Positive);
                    }}
                />
                <MessageInteractionIcon
                    tooltip="Bad response"
                    Icon={BadIcon}
                    selected={currentLabel?.rating === LabelRating.Negative}
                    onClick={async () => {
                        await rateMessage(LabelRating.Negative);
                    }}
                />
                <MessageInteractionIcon
                    tooltip="Inappropriate response"
                    Icon={FlagIcon}
                    selected={currentLabel?.rating === LabelRating.Flag}
                    onClick={async () => {
                        await rateMessage(LabelRating.Flag);
                    }}
                />
            </ButtonGroup>
            <MessageInteractionIcon tooltip="Copy" Icon={ContentCopy} onClick={copyMessage} />
            <Snackbar // TODO: convert to using AlertSlice once PR #396 gets merged.
                open={copySnackbarOpen}
                autoHideDuration={500}
                onClose={() => {
                    setCopySnackbarOpen(false);
                }}
                message="LLM Response Copied."
            />
            <SelectMessageButton messageId={messageId} isLastButton={!autoHideControls} />
        </Stack>
    );
};
