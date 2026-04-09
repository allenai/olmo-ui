import { Container, Paper, PaperProps, useColorScheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { DESKTOP_LAYOUT_BREAKPOINT, SMALL_LAYOUT_BREAKPOINT } from '@/constants';

import { DesktopPageControls } from './DesktopPageControls';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';
import { GlobalSnackMessageList } from './GlobalSnackMessageList';
import { OlmoAppBar } from './OlmoAppBar';

interface AppLayout extends PropsWithChildren {}

export const AppLayout = ({ children }: AppLayout) => {
    const { mode, systemMode } = useColorScheme();
    const colorMode = mode === 'system' || !mode ? systemMode ?? 'dark' : mode;
    return (
        <OuterContainer>
            <OlmoAppBar />
            <GlobalSnackMessageList />
            <Container
                component="main"
                sx={[
                    {
                        display: 'grid',
                        flexDirection: 'column',

                        overflow: 'auto',

                        height: 1,

                        gridArea: {
                            // Give this the full content width at small, fixes gridRendering on iOS 16
                            [SMALL_LAYOUT_BREAKPOINT]: 'content',
                            // this maps to grid-row-start / grid-column-start / grid-row-end / grid-column-end
                            [DESKTOP_LAYOUT_BREAKPOINT]: 'aside / content / aside / aside',
                        },
                        gridTemplateColumns: 'subgrid',
                        gridTemplateRows: 'subgrid',
                        backgroundColor: 'transparent',
                    },
                    {
                        '--color-transparent-text-accent': (theme) =>
                            // TODO: eval if this is still needed or if varnish proper is fine
                            colorMode === 'light'
                                ? theme.color['gray-50'].hex
                                : theme.color['gray-10'].hex,

                        '@supports(color: rgb(from white r g b))': {
                            // This matches the placeholder color in the prompt input
                            '--color-transparent-text-accent':
                                // TODO: eval if this is still needed or if varnish proper is fine
                                `rgb(from currentColor r g b / ${colorMode === 'light' ? 0.42 : 0.5})`,
                        },

                        scrollbarColor: `var(--color-transparent-text-accent, currentColor) transparent`,
                    },
                ]}
                maxWidth={false}>
                <ErrorBoundary
                    FallbackComponent={ErrorBoundaryFallback}
                    onError={(error, info) => {
                        analyticsClient.trackError(error, info);
                    }}>
                    {children}
                </ErrorBoundary>
            </Container>
            <DesktopPageControls />
        </OuterContainer>
    );
};

const OuterContainer = (props: PaperProps) => {
    return (
        <Paper
            square
            variant="outlined"
            sx={[
                (theme) => ({
                    height: '100dvh',
                    width: '100%',
                    border: 0,
                    position: 'fixed',

                    display: 'grid',
                    gridTemplateAreas: `
                        'app-bar'
                        'content'
                    `,
                    gridTemplateRows: 'auto 1fr',

                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        gridTemplateAreas: `
                            'nav app-bar aside controls'
                            'nav content aside controls'`,
                        gridTemplateRows: 'auto minmax(0, 1fr)',
                        gridTemplateColumns: 'auto 1fr auto auto',
                    },
                }),
            ]}
            {...props}
        />
    );
};
