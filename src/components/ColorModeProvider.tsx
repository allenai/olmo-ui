import { ErrorBoundary } from '@allenai/varnish2/components';
import { varnishTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import {
    createTheme,
    CssBaseline,
    PaletteMode,
    ThemeOptions,
    ThemeProvider,
    useColorScheme,
} from '@mui/material';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { uiRefreshOlmoTheme } from '../olmoTheme';

export type ColorPreference = PaletteMode | 'system';

type VarnishAppWithColorModeProps = PropsWithChildren<{
    defaultThemeColorMode?: PaletteMode;
    theme: ThemeOptions;
}>;

// Must be inside ThemeProvider to use useColorScheme
const PandaColorModeSetter = () => {
    const { mode, systemMode } = useColorScheme();

    // Sync body class for Panda CSS dark mode conditions
    useEffect(() => {
        const colorMode: PaletteMode = mode === 'system' || !mode ? systemMode ?? 'dark' : mode;
        document.body.classList.toggle('dark', colorMode === 'dark');
        document.body.classList.toggle('light', colorMode !== 'dark');
    }, [mode, systemMode]);

    return null;
};

export const VarnishAppWithColorMode = ({
    children,
    defaultThemeColorMode = 'dark',
    theme = uiRefreshOlmoTheme,
}: VarnishAppWithColorModeProps) => {
    const mergedTheme = useMemo(() => {
        const routerOverrides = getRouterOverriddenTheme(Link, theme);
        // TODO: fox varnishTheme's createTheme to properly handle the CSS variables path so we don't have to pass it in here.
        //
        // varnishTheme.cssVariables is undefined on the processed object, so we must pass
        // cssVariables explicitly as the first arg to ensure createTheme takes the CSS vars path
        // and properly processes colorSchemes overrides.
        //
        // Once varnish's getTheme is fixed to do:
        //   createTheme({ cssVariables: { colorSchemeSelector: 'data' } }, varnishTheme, overrides)
        // this can be simplified to:
        //   return <VarnishApp theme={routerOverrides} defaultMode={defaultThemeColorMode}>
        return createTheme(
            { cssVariables: { colorSchemeSelector: 'data' } },
            varnishTheme,
            routerOverrides
        );
    }, [theme]);

    return (
        <ThemeProvider theme={mergedTheme} defaultMode={defaultThemeColorMode}>
            <CssBaseline />
            <ErrorBoundary>
                <PandaColorModeSetter />
                {children}
            </ErrorBoundary>
        </ThemeProvider>
    );
};
