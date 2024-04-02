import varnishTheme from '@allenai/varnish-theme';
import { Color } from '@allenai/varnish2/theme';
import { ThemeOptions, createTheme } from '@mui/material';

// extended theme to hold olmo specific values and overrides
export const olmoTheme = {
    color2: {
        // @ts-expect-error
        N7: new Color('Black7', '#333333', undefined, true),
        N8: new Color('Black8', '#282828', undefined, true),
        N9: new Color('Black9', '#262626', undefined, true),
        B6: new Color('Blue6', '#BBF4FF', undefined, true),
        O6: new Color('Orange6', '#FFF1BD', undefined, true),
        O7: new Color('Orange7', '#F4D35E', undefined, true),
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) =>
                    theme.unstable_sx({
                        borderRadius: 3,
                    }),
            },
        },
        MuiButton: {
            styleOverrides: {
                root: ({ ownerState }) => ({
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
                tooltip: ({ theme }) => ({
                    backgroundColor: theme.palette.common.white,
                    color: varnishTheme.color.N5.value,
                    boxShadow: theme.shadows[1],
                    fontSize: 12,
                }),
            },
        },
    },
} satisfies ThemeOptions;

// @ts-expect-error The theme options type isn't quite correct
export const uiRefreshOlmoTheme = createTheme(olmoTheme, {
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    ...(ownerState.selected === true && {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,

                        '&:focus-visible,&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }),
                }),
            },
        },
    },
} satisfies Partial<ThemeOptions>);
