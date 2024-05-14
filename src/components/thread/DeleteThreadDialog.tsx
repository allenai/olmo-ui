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
    onCancel: () => void;
}

export const DeleteThreadDialog = ({
    handleDeleteThread,
    open,
    onCancel,
}: DeleteThreadDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: '312px',
                    borderRadius: '10px',
                },
            }}>
            <DialogTitle sx={{ marginBottom: '7px', marginTop: '7px' }}>
                Delete this thread?
            </DialogTitle>
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
                <Button variant="text" onClick={onCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
