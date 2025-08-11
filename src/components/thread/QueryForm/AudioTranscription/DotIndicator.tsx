import { Box } from '@mui/material';

export const DotIndicator = () => {
    return (
        <Box
            sx={(theme) => ({
                '&': {
                    position: 'relative',
                    width: '4px',
                    height: '4px',
                    borderRadius: '999rem',
                    backgroundColor: theme.palette.secondary.light,
                    animation: 'color-pulse 1s infinite linear alternate',
                    animationDelay: '600ms',
                    margin: '0 6px',
                },
                '&::before,&::after': {
                    content: '""',
                    display: 'inline-block',
                    position: 'absolute',
                    top: '0',
                },
                '&::before': {
                    left: '-6px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '999rem',
                    backgroundColor: theme.palette.secondary.light,
                    animation: 'color-pulse 1s infinite alternate',
                    animationDelay: '0ms',
                },
                '&::after': {
                    left: '6px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '999rem',
                    backgroundColor: theme.palette.secondary.light,
                    animation: 'color-pulse 1s infinite alternate',
                    animationDelay: '1000ms',
                },
                '@keyframes color-pulse': {
                    '0%': {
                        opacity: '0.6',
                        backgroundColor: theme.palette.secondary.light,
                    },
                    '50%,100%': {
                        opacity: '1',
                        backgroundColor: theme.palette.text.primary,
                    },
                },
            })}
        />
    );
};
