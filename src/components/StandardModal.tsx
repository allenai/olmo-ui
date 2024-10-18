import { Dialog, DialogProps } from '@mui/material';

export const DEFAULT_MODAL_WIDTH = 970;

export const StandardModal = ({ children, open, ...rest }: DialogProps) => {
    return (
        <Dialog
            fullWidth
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            PaperProps={{
                sx: {
                    maxWidth: `${DEFAULT_MODAL_WIDTH}px`,
                    padding: 3.75,
                    margin: '0 auto',
                    backgroundColor: (theme) => theme.color.N1.hex,
                },
            }}
            {...rest}
            open={open}>
            {children}
        </Dialog>
    );
};
