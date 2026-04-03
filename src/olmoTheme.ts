import { varnishTheme } from '@allenai/varnish2/theme';
import { alpha, ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
    interface TypeBackground {
        code?: string;
        drawer: {
            primary?: string;
            secondary?: string;
        };
    }
    interface TypeText {
        drawer: {
            primary?: string;
            secondary?: string;
        };
    }
}

// extended theme to hold olmo specific values and overrides
export const uiRefreshOlmoTheme = {
    // Top-level palette defines CSS variable structure available in all modes
    palette: {
        background: {
            code: varnishTheme.palette.background.reversed,
            drawer: {
                primary: varnishTheme.palette.background.reversed,
                secondary: varnishTheme.palette.background.default,
            },
        },
        text: {
            drawer: {
                primary: varnishTheme.palette.text.reversed,
                secondary: varnishTheme.palette.primary.dark,
            },
        },
    },
    colorSchemes: {
        light: {
            palette: {
                error: { main: '#d50000' },
            },
        },
        dark: {
            palette: {
                background: {
                    paper: '#032629',
                    reversed: varnishTheme.palette.background.paper,
                    default: '#032629',
                    drawer: {
                        primary: varnishTheme.color['dark-teal-100'].hex,
                        secondary: varnishTheme.color['dark-teal-100'].hex,
                    },
                    code: varnishTheme.palette.background.reversed,
                },
                text: {
                    primary: varnishTheme.palette.text.reversed ?? '#FFF',
                    reversed: varnishTheme.palette.text.primary,
                    secondary: `color-mix(in srgb, ${varnishTheme.palette.text.reversed} 60%, white)`,
                    disabled: `color-mix(in srgb, ${varnishTheme.palette.text.reversed} 38%, white)`,
                    drawer: {
                        primary: varnishTheme.palette.text.reversed,
                        secondary: varnishTheme.palette.secondary.main,
                    },
                },
                primary: {
                    main: varnishTheme.palette.primary.main,
                    contrastText: varnishTheme.palette.text.reversed ?? '#FFF',
                },
                error: { main: '#fe3e3e' },
                action: {
                    active: 'rgba(255, 255, 255, 0.54)',
                    disabled: 'rgba(255, 255, 255, 0.26)',
                    disabledBackground: 'rgba(255, 255, 255, 0.12)',
                },
            },
        },
    },
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
        MuiSelect: {
            styleOverrides: {
                select: ({ theme }) => ({
                    '&&': {
                        paddingRight: theme.spacing(6),
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
        MuiButtonGroup: {
            // These x-child overrides fix issues with conditional rendering inside a ButtonGroup
            // https://github.com/mui/material-ui/issues/39488#issuecomment-2410727625
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiButton-outlined:last-child': {
                        borderTopRightRadius: theme.shape.borderRadius,
                        borderBottomRightRadius: theme.shape.borderRadius,
                        borderRightColor: 'var(--variant-outlinedBorder, currentColor)',
                    },
                    '& .MuiButton-outlined:first-child': {
                        borderTopLeftRadius: theme.shape.borderRadius,
                        borderBottomLeftRadius: theme.shape.borderRadius,
                    },
                    '& .MuiButton-containedPrimary:last-child': {
                        borderTopRightRadius: theme.shape.borderRadius,
                        borderBottomRightRadius: theme.shape.borderRadius,
                        borderRightWidth: 0,
                    },
                    '& .MuiButton-containedPrimary:first-child': {
                        borderTopLeftRadius: theme.shape.borderRadius,
                        borderBottomLeftRadius: theme.shape.borderRadius,
                    },
                }),
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: ({ theme }) => ({
                    marginBlockStart: theme.spacing(1),
                    marginInline: theme.spacing(0),
                }),
            },
        },
    },
} satisfies Partial<ThemeOptions>;
