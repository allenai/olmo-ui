import { Button, Stack } from '@mui/material';

interface InlineContentWarningProps {
    onReveal: () => void;
    children: React.ReactNode;
}

export const InlineContentWarning = ({ onReveal, children }: InlineContentWarningProps) => {
    return (
        <Stack direction="row" alignItems="center" width="100%" spacing={2}>
            {children}
            <Stack
                direction="row"
                alignItems="center"
                sx={{
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
            </Stack>
        </Stack>
    );
};
