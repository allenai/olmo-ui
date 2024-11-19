import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import { links } from '@/Links';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../../constants';
import { Ai2LogoFull } from '../Ai2LogoFull';
import { useDesktopOrUp } from '../dolma/shared';
import { HistoryDrawer } from '../thread/history/HistoryDrawer';
import { NavigationDrawer } from './NavigationDrawer';
import { useRouteTitle } from './useRouteTitle';

export const OlmoAppBar = (): JSX.Element => {
    const title = useRouteTitle();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isDesktopOrUp = useDesktopOrUp();

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            <AppBar
                position="sticky"
                color="inherit"
                elevation={0}
                sx={(theme) => ({
                    gridArea: 'app-bar',

                    backgroundColor: theme.palette.background.drawer.primary,

                    paddingBlock: 1,
                    paddingInline: 2,

                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        paddingBlockStart: 1.5,
                        backgroundColor: 'transparent',
                    },
                })}>
                <Toolbar
                    disableGutters
                    sx={(theme) => ({
                        display: 'grid',
                        gridTemplateColumns: '1fr max-content 1fr',
                        [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                            width: '100%',
                            margin: '0 auto',
                            paddingInline: 3,
                        },
                    })}>
                    <Link
                        href={links.home}
                        lineHeight={1}
                        sx={(theme) => ({
                            justifySelf: 'left',
                            alignItems: 'center',
                            height: '100%',
                            display: 'flex',
                            [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                                display: 'none',
                            },
                        })}>
                        <Ai2LogoFull
                            height={18.5}
                            width={60}
                            alt="Return to the Playground home page"
                        />
                    </Link>
                    <Typography
                        variant={isDesktopOrUp ? 'h1' : 'h3'}
                        component="h1"
                        color="primary"
                        sx={(theme) => ({
                            margin: 0,
                            textAlign: 'center',
                            [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                                textAlign: 'left',
                            },
                        })}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={handleDrawerToggle}
                        color="secondary"
                        sx={{
                            justifySelf: 'end',
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                        }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <HistoryDrawer />
            <NavigationDrawer
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                onDrawerToggle={handleDrawerToggle}
            />
        </>
    );
};
