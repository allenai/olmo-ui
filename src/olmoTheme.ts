import { Color } from '@allenai/varnish2/theme';
import varnishTheme from '@allenai/varnish-theme';

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
                        backgroundColor: varnishTheme.color.B4.value,
                    }),
                    ...((ownerState.variant === 'text' || ownerState.variant === 'outlined') && {
                        color: varnishTheme.color.B4.value,
                    }),
                    '&.Mui-disabled': {
                        background: 'transparent',
                        color: varnishTheme.color.N3.value,
                    },
                }),
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: varnishTheme.color.B4.value,
                    borderColor: varnishTheme.color.B4.value,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    color: varnishTheme.color.B4.value,
                    borderColor: varnishTheme.color.B4.value,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }: any) => ({
                    backgroundColor: theme.palette.common.white,
                    color: varnishTheme.color.N5.value,
                    boxShadow: theme.shadows[1],
                    fontSize: 12,
                }),
            },
        },
    },
};
