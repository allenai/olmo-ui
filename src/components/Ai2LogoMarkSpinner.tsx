import { Box } from '@mui/material';

type Ai2LogoMarkSpinnerProps = Pick<React.ComponentProps<'img'>, 'height' | 'width' | 'alt'> & {
    isAnimating: boolean;
};

export const Ai2LogoMarkSpinner = ({
    width,
    height,
    alt = '',
    isAnimating = true,
}: Ai2LogoMarkSpinnerProps) => {
    return (
        <Box
            sx={{
                '@keyframes spin': {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
                animation: isAnimating ? 'spin 1.33s ease-in-out infinite' : undefined,
            }}>
            <Box
                component="img"
                src="/ai2-monogram.svg"
                alt={alt}
                width={width}
                height={height}
                sx={{ display: 'block' }}
            />
        </Box>
    );
};
