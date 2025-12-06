import { Box, type BoxProps } from '@mui/material';
import { type ReactNode } from 'react';

type SvgSpinnerProps = BoxProps & {
    isAnimating?: boolean;
    children: ReactNode;
};

export const SvgSpinner = ({ isAnimating = true, children, ...rest }: SvgSpinnerProps) => {
    return (
        <Box
            sx={{
                display: 'block',
                '@keyframes spin': {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
                animation: isAnimating ? 'spin 1.33s ease-in-out infinite' : undefined,
            }}
            {...rest}>
            {children}
        </Box>
    );
};
