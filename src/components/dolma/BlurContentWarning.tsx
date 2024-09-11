import { Box, Button, Paper } from '@mui/material';

interface BlurContentWarningProps {
    onReveal: () => void;
    children: React.ReactNode;
}

export const BlurContentWarning = ({ onReveal, children }: BlurContentWarningProps) => {
    return (
        <Paper
            elevation={3}
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                p: 2,
                bgcolor: (theme) => theme.palette.background.default,
                borderRadius: '8px',
                zIndex: 10,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
            {children}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 'auto',
                    mr: '0px',
                }}>
                <Button
                    variant="contained"
                    sx={(theme) => ({
                        bgcolor: theme.palette.error.dark,
                        '&:hover': {
                            bgcolor: theme.palette.error.dark,
                        },
                    })}
                    onClick={onReveal}>
                    Reveal
                </Button>
            </Box>
        </Paper>
    );
};
