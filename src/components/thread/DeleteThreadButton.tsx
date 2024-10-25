import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { DeleteThreadDialog } from './DeleteThreadDialog';
import { ResponsiveButton, ResponsiveButtonProps } from './ResponsiveButton';

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
                title="Delete Thread"
                onClick={onClick}
                disabled={!canUseDeleteButton}
            />
        </>
    );
};

export const DeleteDialog = ({
    openDialog,
    setOpenDialog,
}: {
    openDialog: boolean;
    setOpenDialog: (_: boolean) => void;
}) => {
    const nav = useNavigate();
    const deleteThread = useAppContext((state) => state.deleteThread);
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);

    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const handleDeleteThread = () => {
        if (selectedThreadId) {
            deleteThread(selectedThreadId);
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
