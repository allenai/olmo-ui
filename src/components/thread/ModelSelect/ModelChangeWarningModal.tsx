import { Button, DialogContent, Stack, Typography } from '@mui/material';
import { ComponentProps } from 'react';

import {
    StandardDialogCloseButton,
    StandardDialogTitle,
    StandardModal,
} from '@/components/StandardModal';

interface ModelChangeWarningModalProps extends Pick<ComponentProps<typeof StandardModal>, 'open'> {
    onConfirm: () => void;
    onCancel: () => void;
}

export const ModelChangeWarningModal = ({
    open,
    onCancel,
    onConfirm,
}: ModelChangeWarningModalProps) => {
    return (
        <StandardModal open={open} onClose={onCancel}>
            <DialogContent>
                <StandardDialogCloseButton onClick={onCancel} />
                <StandardDialogTitle variant="h4">
                    Change model and start a new thread?
                </StandardDialogTitle>
                <Stack gap={1}>
                    <Typography>
                        The model you&apos;re switching to isn&apos;t compatible with this thread.
                        To switch models you&apos;ll need to start a new thread. Continue?
                    </Typography>
                    <Stack direction="row" gap={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={onConfirm}>
                            Change model
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </StandardModal>
    );
};
