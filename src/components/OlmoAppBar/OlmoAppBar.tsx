import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Link, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../../constants';
import { useDesktopOrUp } from '../dolma/shared';
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

                    backgroundColor: theme.palette.background.reversed,

                    paddingBlock: 1,
                    paddingInline: 2,

                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        paddingBlockStart: 4,
                        paddingInline: 4,

                        backgroundColor: 'transparent',
                    },
                })}>
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Link
                        href="/"
                        lineHeight={1}
                        sx={{
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                        }}>
                        <img
                            height={18.5}
                            width={60}
                            src="/ai2-logo-full.svg"
                            alt="Return to the Playground home page"
                        />
                    </Link>
                    <Typography
                        variant={isDesktopOrUp ? 'h1' : 'h3'}
                        component="h1"
                        color="primary"
                        sx={{
                            margin: 0,

                            textAlign: 'center',
                        }}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={handleDrawerToggle}
                        // @ts-expect-error - Varnish doesn't support tertiary colors yet
                        color="tertiary"
                        sx={{
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                        }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <NavigationDrawer
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                onDrawerToggle={handleDrawerToggle}
            />
        </>
    );
};
