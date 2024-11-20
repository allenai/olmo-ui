import { AddBoxOutlined, IosShareOutlined, TuneOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    ButtonGroup,
    IconButton,
    IconButtonOwnProps,
    IconButtonProps,
    Link,
    SxProps,
    Theme,
    Toolbar,
    Tooltip,
    TooltipProps,
    Typography,
} from '@mui/material';
import { MouseEventHandler, PropsWithChildren, useState } from 'react';
import { useMatch } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../../constants';
import { Ai2MarkLogoSVG } from '../svg/Ai2MarkLogoSVG';
import { HistoryDrawer } from '../thread/history/HistoryDrawer';
import { PARAMETERS_DRAWER_ID } from '../thread/parameter/ParameterDrawer';
import { IconButtonWithTooltip } from './IconButtonWithTooltip';
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

    const isOnThreadPage = useMatch({ path: links.thread(':id') });

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
                        <Ai2MarkLogoSVG width={30} />
                    </Link>
                    <ButtonGroup
                        sx={{
                            justifySelf: 'end',
                            display: { [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
                        }}>
                        {isOnThreadPage && (
                            <>
                                <ShareThreadIconButton />
                                <ParameterIconButton />
                            </>
                        )}
                        <NewThreadIconButton />
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

    const toggleParametersDrawer = () => {
        toggleDrawer(PARAMETERS_DRAWER_ID);
    };

    return (
        <IconButtonWithTooltip onClick={toggleParametersDrawer} label="Show parameters">
            <TuneOutlined />
        </IconButtonWithTooltip>
    );
};

export const ShareThreadIconButton = () => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const { isAuthenticated } = useUserAuthInfo();

    const shouldDisableShareButton = !selectedThreadId || !isAuthenticated;

    const handleShareThread = async () => {
        await navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));
        addSnackMessage({
            id: `thread-copy-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Link Copied',
        });
    };

    return (
        <IconButtonWithTooltip
            onClick={handleShareThread}
            disabled={shouldDisableShareButton}
            label="Share this thread">
            <IosShareOutlined
                sx={{
                    // This Icon looks visually off when centered
                    transform: 'translateY(-2px)',
                }}
            />
        </IconButtonWithTooltip>
    );
};

const NewThreadIconButton = () => {
    return (
        <IconButtonWithTooltip href={links.playground} label="Create a new thread">
            <AddBoxOutlined />
        </IconButtonWithTooltip>
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
