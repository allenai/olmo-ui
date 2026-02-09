import {
    ContentCopy,
    Flag,
    FlagOutlined,
    ThumbDown,
    ThumbDownOutlined,
    ThumbUp,
    ThumbUpOutlined,
} from '@mui/icons-material';
import { ButtonGroup, Stack } from '@mui/material';
import { useCallback } from 'react';

import { ExclusiveRatings, LabelRating } from '@/api/Label';
import {
    type SchemaFlatMessage,
    type SchemaLabelRequest,
} from '@/api/playgroundApi/v5playgroundApiSchema';
import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { CHAT_MESSAGE_CLASS_NAME } from '../ChatMessage/ChatMessage';
import { MessageInteractionIcon } from './MessageInteractionIcon';
import { OlmoTraceButton } from './OlmoTraceButton';
import { RawToggleButton } from './RawToggleButton';
import { usePutLabels } from './usePutLabels';

interface MessageInteractionProps {
    role: SchemaFlatMessage['role'];
    messageLabels: SchemaFlatMessage['labels'];
    content: SchemaFlatMessage['content'];
    messageId: SchemaFlatMessage['id'];
    isLastMessage: boolean;
    isStreaming: boolean;
    isRawMode: boolean;
    setRawMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MessageInteraction = ({
    role,
    messageLabels = [],
    content,
    messageId,
    isLastMessage,
    isStreaming,
    isRawMode,
    setRawMode,
}: MessageInteractionProps): React.JSX.Element | null => {
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const putLabels = usePutLabels();
    const currentLabels: SchemaLabelRequest[] = messageLabels.map(({ rating, comment }) => ({
        rating,
        comment,
    }));

    const ratings = new Set(currentLabels.map((label) => label.rating));
    const hasPositive = ratings.has(LabelRating.Positive);
    const hasNegative = ratings.has(LabelRating.Negative);
    const hasFlag = ratings.has(LabelRating.Flag);

    const GoodIcon = hasPositive ? ThumbUp : ThumbUpOutlined;
    const BadIcon = hasNegative ? ThumbDown : ThumbDownOutlined;
    const FlagIcon = hasFlag ? Flag : FlagOutlined;

    const rateMessage = async (newRating: LabelRating) => {
        let newLabels: SchemaLabelRequest[];

        // is toggling a label
        const isTogglingOff = currentLabels.some((label) => label.rating === newRating);

        if (isTogglingOff) {
            // filter toggled label out
            newLabels = currentLabels.filter((label) => label.rating !== newRating);
        } else {
            // if its an exclusive label, filter all exclusive labels out
            newLabels = ExclusiveRatings.has(newRating)
                ? currentLabels.filter((label) => !ExclusiveRatings.has(label.rating))
                : [...currentLabels];

            // add new label
            newLabels.push({
                rating: newRating,
                comment: undefined, // we don't have comments right now
            });
        }

        await putLabels(messageId, newLabels);
    };

    const copyMessage = useCallback(async () => {
        await navigator.clipboard.writeText(content);
        addSnackMessage({
            id: `response-copied-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'LLM Response Copied.',
            autoHideDuration: 500,
        });
    }, [content, addSnackMessage]);

    const shouldHide = role === Role.User || isStreaming;

    if (shouldHide) {
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
                        opacity: isLastMessage ? 1 : 0,
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
                    selected={hasPositive}
                    onClick={async () => {
                        await rateMessage(LabelRating.Positive);
                    }}
                />
                <MessageInteractionIcon
                    tooltip="Bad response"
                    Icon={BadIcon}
                    selected={hasNegative}
                    onClick={async () => {
                        await rateMessage(LabelRating.Negative);
                    }}
                />
                <MessageInteractionIcon
                    tooltip="Inappropriate response"
                    Icon={FlagIcon}
                    selected={hasFlag}
                    onClick={async () => {
                        await rateMessage(LabelRating.Flag);
                    }}
                />
            </ButtonGroup>
            <MessageInteractionIcon tooltip="Copy" Icon={ContentCopy} onClick={copyMessage} />
            <RawToggleButton
                isRawMode={isRawMode}
                setRawMode={setRawMode}
                messageId={messageId}
                isLastButton={isLastMessage}
            />
            <OlmoTraceButton messageId={messageId} isLastButton={isLastMessage} />
        </Stack>
    );
};
