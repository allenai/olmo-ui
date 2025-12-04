import { Close } from '@mui/icons-material';
import { Backdrop, BackdropProps, Dialog, IconButton } from '@mui/material';
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
                    color: 'white',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                },
            }}
            slots={{
                backdrop: BackdropWithCloseButton,
            }}
            slotProps={{
                backdrop: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                    onClick: onClose,
                },
            }}>
            {children}
        </Dialog>
    );
};

const BackdropWithCloseButton = (props: BackdropProps) => {
    return (
        <Backdrop {...props}>
            <IconButton
                aria-label="close"
                sx={(theme) => ({
                    position: 'fixed',
                    right: '10dvw',
                    top: '10dvh',
                    color: theme.palette.grey[500],
                    border: '2px solid currentColor',
                })}>
                <Close />
            </IconButton>
        </Backdrop>
    );
};
