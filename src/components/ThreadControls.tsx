import {
    Delete,
    Flag,
    FlagOutlined,
    Send,
    ThumbDown,
    ThumbDownOutlined,
    ThumbUp,
    ThumbUpOutlined,
} from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import styled from 'styled-components';

import { LabelRating } from '../api/Label';
import { Message } from '../api/Message';
import { useAppContext } from '../AppContext';
import { RemoteState } from '../contexts/util';

interface ThreadControlProps {
    rootMessage: Message;
    threadCreator: string;
}

export const ThreadControls = ({ rootMessage, threadCreator }: ThreadControlProps) => {
    const userInfo = useAppContext((state) => state.userInfo);
    const deleteThread = useAppContext((state) => state.deleteThread);
    const isDeletingThread = useAppContext(
        (state) => state.deleteThreadRemoteState === RemoteState.Loading
    );
    const postLabel = useAppContext((state) => state.postLabel);
    const deleteLabel = useAppContext((state) => state.deleteLabel);
    const labelRemoteState = useAppContext((state) => state.labelRemoteState);

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

    const currentClient = userInfo?.client;

    return (
        <div>
            <ThreadActionButton
                variant="text"
                startIcon={<GoodIcon />}
                disabled={labelRemoteState === RemoteState.Loading}
                onClick={() => addLabel(LabelRating.Positive)}>
                <Typography>Good</Typography>
            </ThreadActionButton>
            <ThreadActionButton
                variant="text"
                startIcon={<BadIcon />}
                disabled={labelRemoteState === RemoteState.Loading}
                onClick={() => addLabel(LabelRating.Negative)}>
                <Typography>Bad</Typography>
            </ThreadActionButton>
            <ThreadActionButton
                variant="text"
                startIcon={<FlagIcon />}
                disabled={labelRemoteState === RemoteState.Loading}
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
                    disabled={isDeletingThread}
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
        color: ${({ theme }) => theme.color2.B4.hex};
    }
`;
