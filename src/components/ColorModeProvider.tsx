import { VarnishApp } from '@allenai/varnish2/components';
import { getTheme } from '@allenai/varnish2/theme';
import { getRouterOverriddenTheme } from '@allenai/varnish2/utils';
import { PaletteMode, ThemeOptions, useMediaQuery } from '@mui/material';
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { olmoThemePaletteMode, uiRefreshOlmoTheme } from '../olmoTheme';

type ColorPreference = PaletteMode | 'system';

type ColorModeContextValues = [ColorPreference, (color: ColorPreference) => void];

const ColorModeContext = createContext<ColorModeContextValues>([
    'light',
    (_: ColorPreference) => {},
]);

type ColorModeProviderProps = PropsWithChildren<{
    defaultColorPreference?: ColorPreference;
    defaultThemeColorMode?: PaletteMode;
    theme: ThemeOptions;
}>;

export const ColorModeProvider = ({
    children,
    defaultColorPreference = 'system',
    defaultThemeColorMode = 'light',
    theme = uiRefreshOlmoTheme,
}: ColorModeProviderProps) => {
    const [colorPreference, setColorPreference] = useState<ColorPreference>(defaultColorPreference);
    const [themeColorMode, setThemeColorMode] = useState<PaletteMode>(defaultThemeColorMode);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const combinedTheme = useMemo(() => {
        return olmoThemePaletteMode(
            getTheme(getRouterOverriddenTheme(Link, theme)),
            themeColorMode
        );
    }, [themeColorMode, theme]);

    const changeColorScheme = useCallback(
        (color: ColorPreference) => {
            setColorPreference(color);
            localStorage.setItem('color-scheme-preference', color);
            const newThemeColorMode =
                color === 'system' ? (prefersDarkMode ? 'dark' : 'light') : color;
            if (newThemeColorMode !== themeColorMode) {
                setThemeColorMode(newThemeColorMode);
            }
        },
        [prefersDarkMode, themeColorMode]
    );

    useEffect(() => {
        const preference = (localStorage.getItem('color-scheme-preference') ||
            'system') as ColorPreference;
        changeColorScheme(preference);
    }, [changeColorScheme]);

    return (
        <ColorModeContext.Provider value={[colorPreference, changeColorScheme]}>
            <ThemeProvider theme={combinedTheme}>
                <VarnishApp layout="left-aligned" theme={combinedTheme}>
                    {children}
                </VarnishApp>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export const useColorMode = () => {
    return useContext(ColorModeContext);
};
