import varnishTheme from '@allenai/varnish-theme';
import { Color } from '@allenai/varnish2/theme';
import { alpha, ThemeOptions } from '@mui/material';
import deepmerge from 'deepmerge';

// extended theme to hold olmo specific values and overrides
export const olmoTheme = {
    // @ts-expect-error - our theme mapping isn't quite right, we'll need to make an override if these stick around
    color2: {
        N7: new Color('Black7', '#333333', undefined, true),
        N8: new Color('Black8', '#282828', undefined, true),
        N9: new Color('Black9', '#262626', undefined, true),
        B6: new Color('Blue6', '#BBF4FF', undefined, true),
        O6: new Color('Orange6', '#FFF1BD', undefined, true),
        O7: new Color('Orange7', '#F4D35E', undefined, true),
    },
    components: {},
} satisfies ThemeOptions;

export const uiRefreshOlmoTheme = deepmerge(olmoTheme, {
    components: {
        MuiButton: {},
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
                    fontSize: theme.typography.body1.fontSize,
                    fontWeight: 'bold',
                    '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.text.primary,
                    },
                }),
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.default,
                    '&.Mui-expanded': {
                        margin: 0,
                    },
                }),
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.primary.main,
                    '.MuiAccordionSummary-expandIconWrapper': {
                        color: 'inherit',
                    },

                    '&.Mui-expanded': {
                        // This is the default min height before it gets bigger from expanding
                        minHeight: 48,
                        '.MuiAccordionSummary-content': {
                            margin: 0,
                        },
                    },
                }),
            },
        },
        MuiStack: {
            defaultProps: {
                useFlexGap: true,
            },
        },
        MuiSkeleton: {
            defaultProps: {
                animation: 'wave',
            },
        },
    },
} satisfies Partial<ThemeOptions>);
