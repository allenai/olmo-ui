import varnishTheme from '@allenai/varnish-theme';
import { Color } from '@allenai/varnish2/theme';
import { ThemeOptions, alpha } from '@mui/material';
import deepmerge from 'deepmerge';

// extended theme to hold olmo specific values and overrides
export const olmoTheme = {
    // @ts-ignore
    color2: {
        N7: new Color('Black7', '#333333', undefined, true),
        N8: new Color('Black8', '#282828', undefined, true),
        N9: new Color('Black9', '#262626', undefined, true),
        B6: new Color('Blue6', '#BBF4FF', undefined, true),
        O6: new Color('Orange6', '#FFF1BD', undefined, true),
        O7: new Color('Orange7', '#F4D35E', undefined, true),
    },
    components: {
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
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[1],
                    fontSize: 12,
                }),
            },
        },
    },
} satisfies ThemeOptions;

export const uiRefreshOlmoTheme = deepmerge(olmoTheme, {
    components: {
        MuiButton: {
            styleOverrides: {
                root: ({ theme, ownerState }) => ({
                    // We may be able to get rid of these overrides when we remove old olmo
                    ...(ownerState.variant === 'contained' && {
                        backgroundColor: theme.palette.primary.main,
                    }),
                    ...((ownerState.variant === 'text' || ownerState.variant === 'outlined') && {
                        color: theme.palette.primary.main,
                    }),
                }),
            },
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) =>
                    theme.unstable_sx({
                        borderRadius: 3,
                    }),
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,

                        '&:focus-visible,&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                }),
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontSize: 16,
                    fontWeight: 'bold',
                    '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.text.primary,
                    },
                }),
            },
        },
    },
} satisfies Partial<ThemeOptions>);
