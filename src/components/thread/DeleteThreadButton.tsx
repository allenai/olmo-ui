import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { DeleteThreadDialog } from './DeleteThreadDialog';
import { ResponsiveButton } from './ResponsiveButton';

const isAfterThirtyDays = (selectedThreadDate: Date | undefined) => {
    const targetDate = dayjs(selectedThreadDate).add(29, 'days').format('YYYY-MM-DD');

    const isAfterThirtyDays = dayjs().isAfter(targetDate, 'day');

    return isAfterThirtyDays;
};

export const DeleteThreadButton = () => {
    const nav = useNavigate();
    const deleteThread = useAppContext((state) => state.deleteThread);
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const isPastThirtyDays = useAppContext((state) =>
        isAfterThirtyDays(state.selectedThreadInfo.data?.created)
    );
    const canUseDeleteButton = useAppContext(
        (state) => state.selectedThreadInfo.data?.creator === state.userInfo?.client
    );
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const [openDialog, setOpenDialog] = useState<boolean>(false);

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

    const handleOnClick = () => {
        setOpenDialog(true);
    };

    if (isPastThirtyDays || !selectedThreadId) {
        return null;
    }

    return (
        <>
            <ResponsiveButton
                variant="outlined"
                startIcon={<DeleteOutlinedIcon />}
                title="Delete Thread"
                onClick={handleOnClick}
                disabled={selectedThreadId.length !== 0 && !canUseDeleteButton}
            />
            <DeleteThreadDialog
                open={openDialog}
                onCancel={() => {
                    setOpenDialog(false);
                }}
                handleDeleteThread={handleDeleteThread}
            />
        </>
    );
};
