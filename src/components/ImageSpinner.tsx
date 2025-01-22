import { Box, type BoxProps } from '@mui/material';

type ImageSpinnerProps = BoxProps &
    Pick<React.ComponentProps<'img'>, 'src' | 'height' | 'width' | 'alt'> & {
        isAnimating?: boolean;
    };

export const ImageSpinner = ({
    src,
    width,
    height,
    alt = '',
    isAnimating = true,
    ...rest
}: ImageSpinnerProps) => {
    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            width={width}
            height={height}
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
            {...rest}
        />
    );
};
