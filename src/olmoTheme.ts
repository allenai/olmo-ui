import { Color, color2 } from '@allenai/varnish2/theme';

// extended theme to hold olmo specific values and overrides
export const olmoTheme = {
    color2: {
        N7: new Color('Black7', '#333333', true),
        N8: new Color('Black8', '#282828', true),
        N9: new Color('Black9', '#262626', true),
        B6: new Color('Blue6', '#BBF4FF', true),
        O6: new Color('Orange6', '#FFF1BD', true),
        O7: new Color('Orange7', '#F4D35E', true),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: ({ ownerState }: any) => ({
                    ...(ownerState.variant === 'contained' && {
                        backgroundColor: color2.B4.hex,
                    }),
                    ...((ownerState.variant === 'text' || ownerState.variant === 'outlined') && {
                        color: color2.B4.hex,
                    }),
                    '&.Mui-disabled': {
                        background: 'transparent',
                        color: color2.N3.hex,
                    },
                }),
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
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }: any) => ({
                    backgroundColor: theme.palette.common.white,
                    color: color2.N5.hex,
                    boxShadow: theme.shadows[1],
                    fontSize: 12,
                }),
            },
        },
    },
};
