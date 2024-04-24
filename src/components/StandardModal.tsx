import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';

export const StandardModal = ({ children, open, ...rest }: DialogProps) => {
    const theme = useTheme();
    const isLessThanMedium = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
            fullWidth
            fullScreen={isLessThanMedium}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            PaperProps={{
                sx: { padding: 6, borderRadius: isLessThanMedium ? 0 : 3 },
            }}
            {...rest}
            open={open}>
            {children}
        </Dialog>
    );
};
