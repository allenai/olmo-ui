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
                enableColorOnDark
                elevation={0}
                sx={{
                    gridArea: 'app-bar',
                }}>
                <Toolbar
                    disableGutters
                    sx={{
                        paddingBlockStart: 4,
                        paddingInline: 4,

                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        alignItems: 'center',
                    }}>
                    <Link
                        href="/"
                        sx={{
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                            gridColumn: '1',
                            gridRow: '1',
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
                            // marginInline: 'auto',

                            textAlign: 'center',
                            gridColumn: '1 / -1',
                            gridRow: '1',
                        }}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                            gridColumn: '-1',
                            gridRow: '1',
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
