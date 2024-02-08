import { Color } from '@allenai/varnish2/theme';
import color2 from '@allenai/varnish-theme';

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
                        backgroundColor: color2.color.B4.attributes.hex,
                    }),
                    ...((ownerState.variant === 'text' || ownerState.variant === 'outlined') && {
                        color: color2.color.B4.attributes.hex,
                    }),
                    '&.Mui-disabled': {
                        background: 'transparent',
                        color: color2.color.N3.attributes.hex,
                    },
                }),
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: color2.color.B4.attributes.hex,
                    borderColor: color2.color.B4.attributes.hex,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    color: color2.color.B4.attributes.hex,
                    borderColor: color2.color.B4.attributes.hex,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }: any) => ({
                    backgroundColor: theme.palette.common.white,
                    color: color2.color.N5.attributes.hex,
                    boxShadow: theme.shadows[1],
                    fontSize: 12,
                }),
            },
        },
    },
};
