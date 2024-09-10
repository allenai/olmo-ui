import { Box, Button } from '@mui/material';

export const InlineContentWarning = ({
    onReveal,
    content,
}: {
    onReveal: () => void;
    content: React.ReactNode;
}) => {
    return (
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            {content}
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
