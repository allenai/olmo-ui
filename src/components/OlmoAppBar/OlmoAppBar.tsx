import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Link, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../../constants';
import { NavigationDrawer } from './NavigationDrawer';
import { useRouteTitle } from './useRouteTitle';

export const OlmoAppBar = (): JSX.Element => {
    const title = useRouteTitle();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

    return (
        <>
            <AppBar
                position="sticky"
                color="inherit"
                enableColorOnDark
                elevation={0}
                sx={{
                    gridArea: 'app-bar',
                    paddingInline: 2,
                    paddingBlock: 3,
                }}>
                <Toolbar
                    component={Stack}
                    direction="row"
                    disableGutters
                    gap={4}
                    alignItems="center">
                    <Link href="/">
                        <img
                            src="/olmo-logo-light.svg"
                            alt="Return to Olmo home"
                            height={46}
                            width={91}
                        />
                    </Link>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                            margin: 0,
                            display: { xs: 'none', [DESKTOP_LAYOUT_BREAKPOINT]: 'block' },
                        }}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                            marginInlineStart: 'auto',
                        }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <NavigationDrawer open={isDrawerOpen} onClose={handleDrawerClose}></NavigationDrawer>
        </>
    );
};
