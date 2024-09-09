import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Paper, Typography } from '@mui/material';

import { ToxicContentPopover } from './ToxicContentPopover';

interface ToxicContentWarningProps {
    isRevealed: boolean;
    onReveal: () => void;
}

export const ToxicContentWarning = ({ isRevealed, onReveal }: ToxicContentWarningProps) => {
    return (
        <Paper
            elevation={isRevealed ? 0 : 3}
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isRevealed ? 'flex-start' : 'space-between',
                p: 2,
                bgcolor: (theme) => theme.color.N1.hex,
                borderRadius: '8px',
                zIndex: isRevealed ? 0 : 10,
                position: isRevealed ? 'static' : 'absolute',
                top: isRevealed ? 'auto' : '50%',
                left: isRevealed ? 'auto' : '50%',
                transform: isRevealed ? 'none' : 'translate(-50%, -50%)',
                marginLeft: isRevealed ? '-17px' : '0px',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                    <WarningAmberIcon
                        sx={(theme) => ({
                            mr: 1,
                            color: theme.palette.error.dark,
                        })}
                    />
                    <Typography
                        sx={(theme) => ({
                            color: theme.palette.error.dark,
                        })}>
                        Caution
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                    <Typography>May contain inappropriate language</Typography>
                    <ToxicContentPopover />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 'auto',
                    mr: isRevealed ? '-22px' : '0px',
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
                    {isRevealed ? 'Conceal' : 'Reveal'}
                </Button>
            </Box>
        </Paper>
    );
};
