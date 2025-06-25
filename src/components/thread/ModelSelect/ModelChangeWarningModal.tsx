import { Button, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import { ComponentProps } from 'react';

import {
    StandardDialogCloseButton,
    StandardDialogTitle,
    StandardModal,
} from '@/components/StandardModal';

interface ModelChangeWarningModalProps extends Pick<ComponentProps<typeof StandardModal>, 'open'> {
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
}

export const ModelChangeWarningModal = ({
    open,
    onCancel,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Change model',
}: ModelChangeWarningModalProps) => {
    return (
        <StandardModal open={open} onClose={onCancel}>
            <DialogContent>
                <StandardDialogCloseButton onClick={onCancel} />
                <StandardDialogTitle variant="h4">{title}</StandardDialogTitle>
                <Stack gap={1}>
                    <Typography>{message}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={onConfirm}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </StandardModal>
    );
};
