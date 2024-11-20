import { AddBoxOutlined, IosShareOutlined, TuneOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, ButtonGroup, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../../constants';
import { Ai2MarkLogoSVG } from '../svg/Ai2MarkLogoSVG';
import { HistoryDrawer } from '../thread/history/HistoryDrawer';
import { PARAMETERS_DRAWER_ID } from '../thread/parameter/ParameterDrawer';
import { NavigationDrawer } from './NavigationDrawer';
import { useRouteTitle } from './useRouteTitle';

export const OlmoAppBar = (): JSX.Element => {
    const { title, showTitle } = useRouteTitle();
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
                    <IconButton
                        onClick={handleDrawerToggle}
                        color="primary"
                        sx={{
                            justifySelf: 'start',
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                        }}>
                        <MenuIcon />
                    </IconButton>
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
                        <Ai2MarkLogoSVG width={30} />
                    </Link>
                    <ButtonGroup
                        sx={{
                            justifySelf: 'end',
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                        }}>
                        <ShareThreadIconButton />
                        <ParameterIconButton />
                        <IconButton color="primary" href={links.playground}>
                            <AddBoxOutlined />
                        </IconButton>
                    </ButtonGroup>
                </Toolbar>
                <Typography
                    variant="h1"
                    component="h1"
                    color="primary"
                    data-heading-below="true"
                    sx={{
                        background: 'transparent',
                        margin: '1rem 1rem 0',
                        textAlign: 'left',
                        display: showTitle ? 'block' : 'none',
                    }}>
                    {title}
                </Typography>
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

export const ParameterIconButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const canUseParameterButton = useAppContext(
        (state) =>
            state.selectedThreadRootId === '' ||
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.selectedThreadRootId]?.creator ===
                state.userInfo?.client
    );
    const toggleParametersDrawer = () => {
        toggleDrawer(PARAMETERS_DRAWER_ID);
    };

    if (!canUseParameterButton) {
        return null;
    }

    return (
        <IconButton
            color="primary"
            onClick={toggleParametersDrawer}
            disabled={!canUseParameterButton}>
            <TuneOutlined />
        </IconButton>
    );
};

export const ShareThreadIconButton = () => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const { isAuthenticated } = useUserAuthInfo();

    const shouldHideShareButton = !selectedThreadId || !isAuthenticated;

    if (shouldHideShareButton) {
        return null;
    }

    const handleShareThread = async () => {
        await navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));
        addSnackMessage({
            id: `thread-copy-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Link Copied',
        });
    };

    return (
        <IconButton color="primary" onClick={handleShareThread}>
            <IosShareOutlined
                sx={{
                    // This Icon looks visually off when centered
                    transform: 'translateY(-2px)',
                }}
            />
        </IconButton>
    );
};
