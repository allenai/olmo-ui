import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

interface Props {
    title: string;
    contentText: string;
    open: boolean;
    onSuccess: () => void;
    onCancel: () => void;
    cancelText?: string;
    successText?: string;
}
export const Confirm = ({
    title,
    contentText,
    open,
    onCancel,
    onSuccess,
    cancelText = 'Cancel',
    successText = 'OK',
}: Props) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{contentText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{cancelText}</Button>
                <Button onClick={onSuccess}>{successText}</Button>
            </DialogActions>
        </Dialog>
    );
};
