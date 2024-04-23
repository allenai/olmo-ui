import { useState } from 'react';
import { Paper, Modal, ModalProps } from '@mui/material';

export interface StandardModalProps extends Omit<ModalProps, 'open'> {
    isOpen?: boolean;
    disableOutsideClick?: boolean;
    ariaTitle?: string;
    ariaDescription?: string;
}

export const StandardModal = ({
    isOpen,
    disableOutsideClick,
    ariaTitle,
    ariaDescription,
    children,
    ...rest
}: StandardModalProps) => {
    const [open, setOpen] = useState<boolean>(true);
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            onClose={disableOutsideClick ? () => {} : handleClose}
            aria-labelledby={ariaTitle || 'modal-title'}
            aria-describedby={ariaDescription || 'modal-description'}
            {...rest}
            open={typeof isOpen !== 'undefined' ? isOpen : open}>
            <Paper
                sx={(theme) => ({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: 3,
                    padding: 6,
                    [theme.breakpoints.down('md')]: {
                        borderRadius: 0,
                        width: '100%',
                        height: '100%',
                    },
                })}>
                {children}
            </Paper>
        </Modal>
    );
};
