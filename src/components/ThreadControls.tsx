import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import {
    ThumbUp,
    ThumbUpOutlined,
    ThumbDown,
    ThumbDownOutlined,
    Delete,
    Flag,
    FlagOutlined,
    Send,
} from '@mui/icons-material';

import { useAppContext } from '../AppContext';
import { LabelRating } from '../api/Label';
import { Message } from '../api/Message';

interface ThreadControlProps {
    rootMessage: Message;
    threadCreator: string;
}

export const ThreadControls = ({ rootMessage, threadCreator }: ThreadControlProps) => {
    const {
        userInfo,
        deleteThread,
        deletedThreadInfo,
        postLabel,
        postLabelInfo,
        deleteLabel,
        deleteLabelInfo,
    } = useAppContext();
    const addLabel = async (rating: LabelRating) => {
        if (rootMessage.labels.length) {
            // first delete the label rating if we have one
            const onlyDelete = rootMessage.labels[0].rating === rating;
            await deleteLabel(rootMessage.labels[0].id, rootMessage);
            if (onlyDelete) {
                // and if we didn't click on the same rating, then add the new rating
                return;
            }
        }
        postLabel({ rating, message: rootMessage.id }, rootMessage);
    };

    const hideShareButton = rootMessage.private;

    let GoodIcon = ThumbUpOutlined;
    let BadIcon = ThumbDownOutlined;
    let FlagIcon = FlagOutlined;
    rootMessage.labels.forEach((label) => {
        if (label.rating === LabelRating.Positive) {
            GoodIcon = ThumbUp;
        }
        if (label.rating === LabelRating.Negative) {
            BadIcon = ThumbDown;
        }
        if (label.rating === LabelRating.Flag) {
            FlagIcon = Flag;
        }
    });

    const currentClient = userInfo.data?.client;

    return (
        <div>
            <ThreadActionButton
                variant="text"
                startIcon={<GoodIcon />}
                disabled={postLabelInfo.loading || deleteLabelInfo.loading}
                onClick={() => addLabel(LabelRating.Positive)}>
                <Typography>Good</Typography>
            </ThreadActionButton>
            <ThreadActionButton
                variant="text"
                startIcon={<BadIcon />}
                disabled={postLabelInfo.loading || deleteLabelInfo.loading}
                onClick={() => addLabel(LabelRating.Negative)}>
                <Typography>Bad</Typography>
            </ThreadActionButton>
            <ThreadActionButton
                variant="text"
                startIcon={<FlagIcon />}
                disabled={postLabelInfo.loading || deleteLabelInfo.loading}
                onClick={() => addLabel(LabelRating.Flag)}>
                <Typography>Inappropriate</Typography>
            </ThreadActionButton>
            {!hideShareButton && (
                <ThreadActionButton
                    href={`/thread/${rootMessage.id}`}
                    variant="text"
                    startIcon={<Send />}>
                    <Typography>Share</Typography>
                </ThreadActionButton>
            )}
            {currentClient === threadCreator && (
                <ThreadActionButton
                    variant="text"
                    disabled={deletedThreadInfo.loading}
                    onClick={() => deleteThread(rootMessage.id)}
                    startIcon={<Delete />}>
                    <Typography>Delete</Typography>
                </ThreadActionButton>
            )}
        </div>
    );
};

const ThreadActionButton = styled(Button)`
    && {
        color: ${({ theme }) => theme.color2.color.B4.attributes.hex};
    }
`;
