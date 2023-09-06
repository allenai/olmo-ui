import { Color, color2 } from '@allenai/varnish2/theme/colors';

// extended theme to hold olmo specific values and overrides
export const olmoTheme = {
    color2: {
        N7: new Color('Black7', '#333333', true),
        N8: new Color('Black8', '#282828', true),
        N9: new Color('Black9', '#262626', true),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        background: 'green',
                        color: '#dadada',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: color2.B4.hex,
                    borderColor: color2.B4.hex,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    color: color2.B4.hex,
                    borderColor: color2.B4.hex,
                },
            },
        },
    },
};
