import { Container, Paper, PaperProps } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

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

                    paddingBlock: { [DESKTOP_LAYOUT_BREAKPOINT]: 3 },

                    height: 1,

                    gridArea: {
                        // this maps to grid-row-start / grid-column-start / grid-row-end / grid-column-end
                        [DESKTOP_LAYOUT_BREAKPOINT]: 'aside / content / aside / aside',
                    },
                    gridTemplateColumns: 'subgrid',
                    gridTemplateRows: 'subgrid',

                    backgroundColor: (theme) => ({
                        xs: theme.palette.background.default,
                        [DESKTOP_LAYOUT_BREAKPOINT]: 'transparent',
                    }),
                }}
                maxWidth={false}>
                {children}
            </Container>
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

                    display: 'grid',
                    gridTemplateAreas: `
                        'app-bar'
                        'content'
                    `,
                    gridTemplateRows: 'auto 1fr',

                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        gridTemplateAreas: `
                            'nav app-bar aside'
                            'nav content aside'`,
                        gridTemplateRows: 'auto minmax(0, 1fr)',
                        // clamp will keep it between 23rem and 28rem while adjusting to be 25% of the viewport width
                        gridTemplateColumns: 'auto minmax(0, 1fr) clamp(23rem, 25svw, 28rem)',
                        columnGap: theme.spacing(8),
                        rowGap: 2,

                        paddingInlineEnd: 3,
                    },
                }),
            ]}
            {...props}
        />
    );
};
