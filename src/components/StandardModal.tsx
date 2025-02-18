import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogProps, IconButton } from '@mui/material';

import { SMALL_LAYOUT_BREAKPOINT } from '@/constants';

export const DEFAULT_MODAL_WIDTH = 970;

interface StandardModalProps extends DialogProps {
    width?: string | number;
    closeModal?: () => void;
}

export const StandardModal = ({
    children,
    width = DEFAULT_MODAL_WIDTH,
    open,
    closeModal: handleClose,
    sx,
    ...rest
}: StandardModalProps) => {
    return (
        <Dialog
            fullWidth
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                padding: 2,
            }}
            PaperProps={{
                sx: (theme) => ({
                    backgroundColor: 'background.paper',
                    backgroundImage: 'none',

                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                    padding: 2,
                    margin: '0 auto',
                    borderRadius: 2,
                    [theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT)]: {
                        height: 'auto',
                        maxWidth: `${width}px`,
                        padding: 4,
                        borderRadius: 4,
                    },
                }),
            }}
            {...rest}
            open={open}
            onClose={handleClose}>
            {handleClose ? (
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: '8px',
                        top: '8px',
                        [theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT)]: {
                            top: '16px',
                            right: '16px',
                        },
                        color: theme.palette.grey[500],
                    })}>
                    <CloseIcon />
                </IconButton>
            ) : null}
            {children}
        </Dialog>
    );
};
