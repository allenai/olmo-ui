import { varnishTheme } from '@allenai/varnish2/theme';
import { ThemeOptions } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';

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

// extended theme to hold olmo specific values and overrides\
// TODO: eval if this is still needed or if varnish proper is fine
export const uiRefreshOlmoTheme = {
    cssVariables: {
        cssVarPrefix: 'ai2',
        colorSchemeSelector: 'data-color-scheme',
    },
    colorSchemes: {
        light: {
            palette: {
                error: { main: '#d50000' },
                background: {
                    code: varnishTheme.palette.background.reversed,
                    // varnish-theme sets background to 'cream', it was white before
                    default: varnishTheme.color.white.hex,
                    drawer: {
                        primary: varnishTheme.palette.background.reversed,
                        secondary: varnishTheme.color.white.hex,
                    },
                },
                text: {
                    drawer: {
                        primary: varnishTheme.palette.text.reversed,
                        secondary: varnishTheme.palette.primary.dark,
                    },
                },
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
                    fontSize: theme.typography.body1.fontSize,
                    '&.Mui-selected': {
                        backgroundColor: theme.vars.palette.primary.main,
                        color: theme.vars.palette.primary.contrastText,

                        '&:focus-visible,&:hover': {
                            backgroundColor: theme.vars.palette.primary.dark,
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
                        backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.08)`,
                        color: theme.vars.palette.text.primary,
                    },
                }),
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.background.default,
                    '&.Mui-expanded': {
                        margin: 0,
                    },
                }),
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.vars.palette.primary.main,
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
                        // override varnish-mui
                        fontSize: theme.typography.body1.fontSize,
                    },
                }),
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // override varnish-mui
                    fontSize: theme.typography.body1.fontSize,
                }),
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: ({ theme }) => ({
                    // override varnish-mui
                    fontSize: theme.typography.body1.fontSize,
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
        // reset from varnish-mui not sure if this is playground specific or should be varnish
        MuiMenu: {
            styleOverrides: {
                paper: {
                    border: '0',
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                track: {
                    border: 'currentColor',
                    backgroundColor: 'currentColor',
                },
                rail: {
                    backgroundColor: 'currentColor',
                },
                thumb: {
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
    },
} satisfies Partial<ThemeOptions>;
