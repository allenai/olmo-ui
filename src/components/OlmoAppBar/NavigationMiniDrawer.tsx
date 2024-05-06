import { CSSObject, IconButton, Drawer as MuiDrawer, Theme, styled } from '@mui/material';
import { PropsWithChildren, ReactNode, useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { logos } from '@allenai/varnish2/components';

import { useAppContext } from '@/AppContext';

const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('max-width', {
        easing: theme.transitions.easing.easeIn,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('max-width', {
        easing: theme.transitions.easing.easeIn,
        duration: theme.transitions.duration.leavingScreen,
    }),
    // overflowX: 'hidden',
    // width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        gridArea: 'nav',
        '& .MuiPaper-root': { position: 'static' },
        overflowX: 'hidden',
        ...openedMixin(theme),
        ...(open && {
            maxWidth: theme.spacing(45),

            // '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            maxWidth: theme.spacing(7),
            // ...closedMixin(theme),
            // '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);

interface NavigationMiniDrawerProps extends PropsWithChildren {
    Heading: ReactNode;
}

export const NavigationMiniDrawer = ({ children, Heading }: NavigationMiniDrawerProps) => {
    const isNavigationDrawerOpen = useAppContext((state) => state.isNavigationDrawerOpen);
    const toggleIsNavigationDrawerOpen = useAppContext(
        (state) => state.toggleIsNavigationDrawerOpen
    );

    return (
        <Drawer variant="permanent" open={isNavigationDrawerOpen}>
            <DrawerHeader>
                {Heading}
                <IconButton onClick={toggleIsNavigationDrawerOpen}>
                    {isNavigationDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            {children}
        </Drawer>
    );
};
