import { useTheme } from '@mui/material';

export const usePointColors = () => {
    const theme = useTheme();

    return [
        theme.color['pink-100'].hex,
        theme.color['purple-100'].hex,
        theme.color['green-100'].hex,
    ];
};
