import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';

export const StandardModal = ({ children, open, ...rest }: DialogProps) => {
    const theme = useTheme();
    const isLessThanMedium = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
            fullWidth
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            PaperProps={{
                sx: {
                    maxWidth: '970px',
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
