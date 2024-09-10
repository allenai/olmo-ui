import { Box, Button } from '@mui/material';

interface InlineContentWarningProps {
    onReveal: () => void;
    children: React.ReactNode;
}

export const InlineContentWarning = ({ onReveal, children }: InlineContentWarningProps) => {
    return (
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            {children}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 'auto',
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
                    Conceal
                </Button>
            </Box>
        </Box>
    );
};
