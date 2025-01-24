import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Link, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import { links } from '@/Links';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../../constants';
import { IconButtonWithTooltip } from '../IconButtonWithTooltip';
import { Ai2MarkLogoSVG } from '../svg/Ai2MarkLogoSVG';
import { HistoryDrawer } from '../thread/history/HistoryDrawer';
import { NavigationDrawer } from './NavigationDrawer';
import { useRouteControls } from './useRouteControls';
import { useRouteTitle } from './useRouteTitle';

export const OlmoAppBar = (): JSX.Element => {
    const title = useRouteTitle();
    const controls = useRouteControls();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                sx={{
                    gridArea: 'app-bar',
                    backgroundColor: 'transparent',
                }}>
                <Toolbar
                    disableGutters
                    sx={(theme) => ({
                        display: 'grid',

                        backgroundColor: theme.palette.background.drawer.primary,

                        paddingBlock: 1,
                        paddingInline: 2,
                        alignContent: 'center',

                        gridTemplateColumns: '1fr max-content 1fr',
                        [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                            width: '100%',
                            margin: '0 auto',
                            paddingInline: 5,
                            paddingBlockStart: 1.5,
                            display: 'none',
                        },
                    })}>
                    <MenuIconButton onClick={handleDrawerToggle} />
                    <Link
                        href={links.home}
                        sx={(theme) => ({
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                                display: 'none',
                            },
                        })}>
                        <Ai2MarkLogoSVG title="Return to the Playground home page" width={30} />
                    </Link>
                    {controls != null && (
                        <Stack
                            direction="row"
                            sx={{
                                justifySelf: 'end',
                                display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                            }}>
                            {controls}
                        </Stack>
                    )}
                </Toolbar>
                {title != null && (
                    <Typography
                        variant="h1"
                        component="h1"
                        color="primary"
                        data-heading-below="true"
                        sx={{
                            background: 'transparent',
                            margin: '1rem 1rem',
                            textAlign: 'left',
                        }}>
                        {title}
                    </Typography>
                )}
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

const MenuIconButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <IconButtonWithTooltip
            onClick={onClick}
            label="Open the navigation menu"
            sx={{
                justifySelf: 'start',
                display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
            }}>
            <MenuIcon />
        </IconButtonWithTooltip>
    );
};
