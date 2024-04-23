import { useState } from 'react';
import { Dialog, ModalProps, useMediaQuery, useTheme } from '@mui/material';

export interface StandardModalProps extends Omit<ModalProps, 'open'> {
    isOpen?: boolean;
    disableOutsideClick?: boolean;
}

export const StandardModal = ({
    isOpen,
    disableOutsideClick,
    children,
    ...rest
}: StandardModalProps) => {
    const [open, setOpen] = useState<boolean>(true);
    const handleClose = () => {
        setOpen(false);
    };

    const theme = useTheme();
    const isLessThanMedium = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
            fullWidth
            fullScreen={isLessThanMedium}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            PaperProps={{
                sx: { padding: 6, borderRadius: isLessThanMedium ? 0 : 3 },
            }}
            {...rest}
            open={typeof isOpen !== 'undefined' ? isOpen : open}>
            {children}
        </Dialog>
    );
};
