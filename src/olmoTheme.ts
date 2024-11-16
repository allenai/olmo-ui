import { varnishTheme } from '@allenai/varnish2/theme';
import { alpha, PaletteMode, Theme, ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
    interface TypeBackground {
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
    palette: {
        background: {
            drawer: {
                primary: varnishTheme.palette.background.reversed,
                secondary: varnishTheme.palette.background.default,
            },
        },
        text: {
            drawer: {
                primary: varnishTheme.palette.text.reversed,
                secondary: varnishTheme.palette.text.primary,
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
    },
} satisfies Partial<ThemeOptions>;

const darkPaletteFromTheme = (theme: Theme): Theme => {
    const { palette } = theme;
    const { background, text, primary } = palette;
    return {
        ...theme,
        palette: {
            ...palette,
            mode: 'dark',

            background: {
                paper: background.reversed ?? '#000', // this is required
                reversed: background.paper,
                default: background.reversed ?? '#000', // background.reversed ?? '#000', // this is required -- in light mode this is white
                drawer: {
                    primary: '#0D4246',
                    secondary: '#0D4246',
                },
            },
            text: {
                // ...text,
                primary: text.reversed ?? '#FFF', // this is required
                reversed: text.primary,

                // sane-ish defaults? -- MUIs alpha() - ?
                secondary: `color-mix(in srgb, ${text.reversed} 60%, white)`, // 'rgba(0, 0, 0, 0.6)',
                disabled: `color-mix(in srgb, ${text.reversed} 38%, white)`, // 'rgba(0, 0, 0, 0.38)',

                drawer: {
                    primary: text.reversed,
                    secondary: text.reversed,
                },
            },
            primary: {
                ...primary,

                contrastText: text.reversed ?? '#FFF', // default
                // main: 'rgba(240, 82, 156, 1)',
                // light: 'rgba(243, 116, 175, 1)',
                // dark: 'rgba(168, 57, 109, 1)',
            },
            secondary: {
                ...palette.secondary,
                contrastText: text.reversed ?? '#FFF', // default
            },
            tertiary: {
                ...palette.tertiary,
                contrastText: text.reversed ?? '#FFF', // default
            },
            error: {
                ...palette.error,
            },
            warning: {
                ...palette.warning,
            },
            info: {
                ...palette.info,
            },
            success: {
                ...palette.success,
                contrastText: 'goldenrod',
            },
            // divider: '#333',  //rgba(52, 52, 52, 1
            contrastThreshold: 3,
            tonalOffset: 0.2,
            action: {
                active: 'rgba(255, 0, 0, 0.54)',
                hover: 'rgba(0, 255, 0, 0.04)',
                hoverOpacity: 0.04,
                selected: 'rgba(0, 0, 255, 0.08)',
                selectedOpacity: 0.08,
                disabled: 'rgba(255, 255, 0, 0.26)',
                disabledBackground: 'rgba(200, 0, 100, 0.12)',
                disabledOpacity: 0.38,
                focus: 'rgba(40, 50, 200, 0.12)',
                focusOpacity: 0.12,
                activatedOpacity: 0.12,
            },
        },
    };
};

export const olmoThemePaletteMode = (theme: Theme, mode: PaletteMode): Theme =>
    mode === 'dark' ? darkPaletteFromTheme(theme) : theme;
