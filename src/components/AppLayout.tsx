import { Container, Paper, PaperProps } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT, SMALL_LAYOUT_BREAKPOINT } from '@/constants';

import { DesktopPageControls } from './DesktopPageControls';
import { GlobalSnackMessageList } from './GlobalSnackMessageList';
import { OlmoAppBar } from './OlmoAppBar';

interface AppLayout extends PropsWithChildren {}

export const AppLayout = ({ children }: AppLayout) => {
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
                            theme.palette.mode === 'light'
                                ? theme.color['gray-50'].hex
                                : theme.color['gray-10'].hex,

                        '@supports(color: rgb(from white r g b))': {
                            // This matches the placeholder color in the prompt input
                            '--color-transparent-text-accent': (theme) =>
                                `rgb(from currentColor r g b / ${theme.palette.mode === 'light' ? 0.42 : 0.5})`,
                        },

                        scrollbarColor: `var(--color-transparent-text-accent, currentColor) transparent`,
                    },
                ]}
                maxWidth={false}>
                {children}
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
