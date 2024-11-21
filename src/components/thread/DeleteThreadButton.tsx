import { DeleteOutlined } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { isOlderThan30Days } from '@/utils/date-utils';

import { IconButtonWithTooltip } from '../IconButtonWithTooltip';
import { DeleteThreadDialog } from './DeleteThreadDialog';
import { ResponsiveButton, ResponsiveButtonProps } from './ResponsiveButton';
import { useUserAuthInfo } from '@/api/auth/auth-loaders';

type DeleteThreadButtonProps = Partial<
    Pick<ResponsiveButtonProps, 'isResponsive' | 'variant' | 'layout' | 'onClick'>
>;

export const DeleteThreadButton = ({
    variant = 'outlined',
    isResponsive = true,
    layout = 'both',
    onClick,
}: DeleteThreadButtonProps) => {
    const isPastThirtyDays = useAppContext(
        (state) =>
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.selectedThreadRootId]?.isOlderThan30Days || false
    );
    const canUseDeleteButton = useAppContext(
        (state) =>
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.selectedThreadRootId]?.creator ===
            state.userInfo?.client
    );
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);

    if (isPastThirtyDays || !selectedThreadId) {
        return null;
    }

    return (
        <>
            <ResponsiveButton
                variant={variant}
                isResponsive={isResponsive}
                layout={layout}
                startIcon={<DeleteOutlinedIcon />}
                title="Delete this thread"
                onClick={onClick}
                disabled={!canUseDeleteButton}
            />
        </>
    );
};

export const DeleteThreadIconButton = ({ threadId }: { threadId: string }) => {
    const userInfo = useAppContext((state) => state.userInfo);
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const allThreads = useAppContext((state) => state.allThreads);
    const thread = allThreads.find((thread) => thread.id === threadId);
    const { isAuthenticated } = useUserAuthInfo();

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    if (!thread || !userInfo || !isAuthenticated) {
        return null;
    }

    const isPastThirtyDays = isOlderThan30Days(thread.created);

    const canUseDeleteButton = thread.creator === userInfo.client;

    const handleClickDelete = () => {
        setDeleteDialogOpen(true);
    };

    if (isPastThirtyDays || !canUseDeleteButton) {
        return null;
    }

    const isSelectedThread = selectedThreadId === threadId;

    return (
        <>
            <DeleteDialog
                threadId={threadId}
                openDialog={isDeleteDialogOpen}
                setOpenDialog={setDeleteDialogOpen}
            />
            <IconButtonWithTooltip
                sx={(theme) => ({
                    color: isSelectedThread
                        ? theme.color['dark-teal'].hex
                        : theme.palette.text.drawer.primary,
                    opacity: isSelectedThread ? 1 : 0,
                    transition: '300ms opacity ease-in-out',
                    '.Mui-focusVisible ~ div > &': {
                        opacity: 1,
                    },
                    '&.Mui-focusVisible, li:hover &': {
                        opacity: 1,
                    },
                })}
                onClick={handleClickDelete}
                disabled={!canUseDeleteButton}
                label="Delete thread">
                <DeleteOutlined />
            </IconButtonWithTooltip>
        </>
    );
};

export const DeleteDialog = ({
    openDialog,
    setOpenDialog,
    threadId,
}: {
    openDialog: boolean;
    setOpenDialog: (_: boolean) => void;
    threadId: string;
}) => {
    const nav = useNavigate();
    const deleteThread = useAppContext((state) => state.deleteThread);

    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const handleDeleteThread = async () => {
        if (threadId) {
            await deleteThread(threadId);
            setOpenDialog(false);
            nav(links.playground);
            addSnackMessage({
                id: `thread-delete-${new Date().getTime()}`.toLowerCase(),
                type: SnackMessageType.Brief,
                message: 'Thread Deleted',
            });
        }
    };

    return (
        <DeleteThreadDialog
            open={openDialog}
            onCancel={() => {
                setOpenDialog(false);
            }}
            handleDeleteThread={handleDeleteThread}
        />
    );
};
