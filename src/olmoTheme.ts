import { varnishTheme } from '@allenai/varnish2/theme';
import { alpha, Palette, PaletteMode, Theme, ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
    interface TypeBackground {
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
                secondary: varnishTheme.palette.background.paper,
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

const darkPaletteFromTheme = ({ palette }: Theme): Palette => {
    const { background, text, primary } = palette;

    return {
        ...palette,
        mode: 'dark',
        /*
         * For each one that is overridden, either exhastively implement,
         * or, comment out the current values and merge with incoming palette
         */
        background: {
            paper: background.reversed ?? '#000',
            reversed: background.paper,
            default: background.reversed ?? '#000',
            drawer: {
                primary: '#0D4246',
                secondary: '#0D4246',
            },
        },
        text: {
            primary: text.reversed ?? '#FFF',
            reversed: text.primary,

            secondary: `color-mix(in srgb, ${text.reversed} 60%, white)`, // 'rgba(0, 0, 0, 0.6)',
            disabled: `color-mix(in srgb, ${text.reversed} 38%, white)`, // 'rgba(0, 0, 0, 0.38)',
        },
        primary: {
            ...primary,
            contrastText: 'rgba(10, 43, 53, 1)',
        },
    };
};

export const olmoThemePaletteMode = (theme: Theme, mode: PaletteMode): Theme => ({
    ...theme,
    palette: mode === 'dark' ? darkPaletteFromTheme(theme) : theme.palette,
});
