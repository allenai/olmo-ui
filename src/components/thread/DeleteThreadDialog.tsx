import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

interface DeleteThreadDialogProps {
    handleDeleteThread: () => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const DeleteThreadDialog = ({
    handleDeleteThread,
    open,
    setOpen,
}: DeleteThreadDialogProps) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete this thread?</DialogTitle>
            <DialogContent>
                <DialogContentText>This action cannot be undone</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    onClick={handleDeleteThread}
                    sx={{ color: (theme) => theme.palette.error.main }}>
                    Delete Thread
                </Button>
                <Button variant="text" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
