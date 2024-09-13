import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';

export const StandardModal = ({ children, open, ...rest }: DialogProps) => {
    const theme = useTheme();
    const isLessThanMedium = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
            fullWidth
            fullScreen={false}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            maxWidth="md"
            PaperProps={{
                sx: {
                    padding: 6,
                    borderRadius: isLessThanMedium ? 0 : 3,
                    margin: '0 auto',
                },
            }}
            {...rest}
            open={open}>
            {children}
        </Dialog>
    );
};
