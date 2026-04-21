import { VarnishApp } from '@allenai/varnish2/components';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import type { PaletteMode, ThemeOptions } from '@mui/material';
import { useColorScheme } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { uiRefreshOlmoTheme } from '../olmoTheme';

export type ColorPreference = PaletteMode | 'system';

type VarnishAppWithColorModeProps = PropsWithChildren<{
    defaultThemeColorMode?: ColorPreference;
    theme?: ThemeOptions;
}>;

// Must be inside ThemeProvider to use useColorScheme
const PandaColorModeSetter = () => {
    const { mode, systemMode } = useColorScheme();

    // Sync body class for Panda CSS dark mode conditions
    useEffect(() => {
        const colorMode: PaletteMode = mode === 'system' || !mode ? (systemMode ?? 'dark') : mode;
        document.body.classList.toggle('dark', colorMode === 'dark');
        document.body.classList.toggle('light', colorMode !== 'dark');
    }, [mode, systemMode]);

    return null;
};

export const VarnishAppWithColorMode = ({
    children,
    defaultThemeColorMode = 'system',
    theme = uiRefreshOlmoTheme,
}: VarnishAppWithColorModeProps) => {
    const routerOverrides = useMemo(() => getRouterOverriddenTheme(Link, theme), [theme]);

    return (
        <VarnishApp theme={routerOverrides} defaultMode={defaultThemeColorMode}>
            <PandaColorModeSetter />
            {children}
        </VarnishApp>
    );
};
