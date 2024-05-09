import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Snackbar, SnackbarContent } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

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
    const setOpenThreadDeleteSnackbar = useAppContext((state) => state.setOpenThreadDeleteSnackbar);
    const openThreadDeleteSnackbar = useAppContext((state) => state.openThreadDeleteSnackBar);

    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteThread = () => {
        if (selectedThreadId) {
            deleteThread(selectedThreadId);
            setOpenDialog(false);
            nav(links.playground);
        }
    };

    const handleOnClick = () => {
        setOpenDialog(true);
    };

    const handleClose = useDebouncedCallback((_event: React.SyntheticEvent | Event) => {
        setOpenThreadDeleteSnackbar(false);
    }, 5000);

    if (openThreadDeleteSnackbar && !selectedThreadId) {
        return (
            <Snackbar open={openThreadDeleteSnackbar} onClose={handleClose} autoHideDuration={6000}>
                <SnackbarContent
                    message="Thread Delete"
                    sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
                />
            </Snackbar>
        );
    }

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
            />
            <DeleteThreadDialog
                open={openDialog}
                onClose={setOpenDialog}
                handleDeleteThread={handleDeleteThread}
            />
        </>
    );
};
