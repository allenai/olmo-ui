import { Close } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { ReactNode } from 'react';

interface MediaLightboxProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const MediaLightbox = ({ open, onClose, children }: MediaLightboxProps): ReactNode => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            PaperProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: 'white',
                },
            }}
            slotProps={{
                backdrop: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                },
            }}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}>
                <Close />
            </IconButton>
            {children}
        </Dialog>
    );
};
