import { ErrorOutline } from '@mui/icons-material';
import { Box } from '@mui/material';

export const ThreadError = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                minHeight: 120,
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            }}>
            <ErrorOutline
                sx={{
                    fontSize: 48,
                    color: 'error.main',
                    opacity: 0.7,
                }}
            />
        </Box>
    );
};
