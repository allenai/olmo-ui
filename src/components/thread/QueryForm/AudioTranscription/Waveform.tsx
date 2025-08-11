import { css, cva } from '@allenai/varnish-panda-runtime/css';
import { Box } from '@mui/material';

const waveformBaseClassNames = css({
    height: '[32px]',
    width: '[64px]',
    fill: 'accent.secondary',
});

const waveformLineClassName = cva({
    base: {
        animation: ' pulse 0.6s infinite',
    },
    variants: {
        line: {
            '1': {
                animationDelay: '0.15s',
            },
            '2': {
                animationDelay: '0.3s',
            },
            '3': {
                animationDelay: '0.45s',
            },
            '4': {
                animationDelay: '0.6s',
            },
            '5': {
                animationDelay: '0.75s',
            },
            '6': {
                animationDelay: '0.9s',
            },
            '7': {
                animationDelay: '1.05s',
            },
            '8': {
                animationDelay: '1.2s',
            },
            '9': {
                animationDelay: '1.35s',
            },
        },
    },
});

export const Waveform = () => (
    // Box used to store @keyframes
    <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 50 38.05"
        className={waveformBaseClassNames}
        sx={{
            '@keyframes pulse': {
                '0%': {
                    transform: 'scaleY(1)',
                    transformOrigin: '50% 50%',
                },

                '50%': {
                    transform: 'scaleY(.7)',
                    transformOrigin: '50% 50%',
                },
                '100%': {
                    transform: 'scaleY(1)',
                    transformOrigin: '50% 50%',
                },
            },
        }}>
        <path
            className={waveformLineClassName({ line: '1' })}
            d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"
        />
        <path
            className={waveformLineClassName({ line: '2' })}
            d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"
        />
        <path
            className={waveformLineClassName({ line: '3' })}
            d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"
        />
        <path
            className={waveformLineClassName({ line: '4' })}
            d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"
        />
        <path
            className={waveformLineClassName({ line: '5' })}
            d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"
        />
        <path
            className={waveformLineClassName({ line: '6' })}
            d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z"
        />
        <path
            className={waveformLineClassName({ line: '7' })}
            d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z"
        />
        <path
            className={waveformLineClassName({ line: '8' })}
            d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z"
        />
        <path
            className={waveformLineClassName({ line: '9' })}
            d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z"
        />
    </Box>
);
