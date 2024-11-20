import { Container, Paper, PaperProps } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

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
                sx={{
                    display: 'grid',
                    flexDirection: 'column',

                    overflow: 'auto',

                    height: 1,

                    gridArea: {
                        // this maps to grid-row-start / grid-column-start / grid-row-end / grid-column-end
                        [DESKTOP_LAYOUT_BREAKPOINT]: 'aside / content / aside / aside',
                    },
                    gridTemplateColumns: 'subgrid',
                    gridTemplateRows: 'subgrid',
                    backgroundColor: 'transparent',
                }}
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
                        rowGap: 2,
                    },
                }),
            ]}
            {...props}
        />
    );
};
