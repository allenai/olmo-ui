import { logos } from '@allenai/varnish2/components';
import { LoginOutlined as LoginIcon } from '@mui/icons-material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import HelpCenterIcon from '@mui/icons-material/HelpCenterOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import ModelTrainingIcon from '@mui/icons-material/ModelTrainingOutlined';
import { Box, Divider, IconButton, Link, List, Stack, Typography } from '@mui/material';
import { ComponentProps, useEffect } from 'react';
import { UIMatch, useMatches } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { links } from '@/Links';

import { ResponsiveDrawer } from '../ResponsiveDrawer';
import { NavigationLink } from './NavigationLink';

// We'll be using this soon, i figured we could keep it around
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Auth0LoginLink = () => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return (
            <NavigationLink icon={<LogoutIcon />} href={links.logout}>
                Log Out
            </NavigationLink>
        );
    }

    const redirectSearchParams = new URLSearchParams();
    redirectSearchParams.set('redirectTo', window.location.href);
    return (
        <NavigationLink icon={<LoginIcon />} href={links.login(window.location.href)}>
            Log In
        </NavigationLink>
    );
};

const doesMatchPath = (match: UIMatch, ...paths: string[]) => {
    return paths.some((path) => {
        if (path.length === 1) {
            return match.pathname === path;
        }

        return match.pathname.startsWith(path);
    });
};

interface NavigationDrawerProps
    extends Omit<
        ComponentProps<typeof ResponsiveDrawer>,
        'children' | 'miniVariantCollapsedWidth' | 'miniVariantOpenedWidth'
    > {
    onClose: () => void;
    onDrawerToggle: () => void;
}

export const NavigationDrawer = ({
    onClose,
    onDrawerToggle,
    open,
    ...props
}: NavigationDrawerProps): JSX.Element => {
    const matches = useMatches();
    const deepestMatch = matches[matches.length - 1];

    const curriedDoesMatchPath = (...paths: string[]) => doesMatchPath(deepestMatch, ...paths);
    useEffect(() => {
        if (!location.pathname.includes('thread')) {
            onClose();
        }
    }, [location.pathname]);

    return (
        <ResponsiveDrawer
            {...props}
            open={open}
            onClose={onClose}
            mobileHeading={<MobileHeading onClose={onClose} />}
            heading={<DesktopHeading />}
            miniHeading={<TabletHeading toggleOpen={onDrawerToggle} open={open} />}
            enableMiniVariant
            miniVariantCollapsedWidth={7}
            miniVariantExpandedWidth={45}
            desktopDrawerSx={{ gridArea: 'nav' }}>
            <Box component="nav" sx={{ height: 1, overflowX: 'hidden' }}>
                <Stack component={List} flexGrow={1} direction="column" sx={{ height: 1 }}>
                    <NavigationLink
                        href={links.playground}
                        icon={<ChatBubbleIcon />}
                        selected={curriedDoesMatchPath(links.playground, links.thread(''))}>
                        OLMo Playground
                    </NavigationLink>
                    <NavigationLink
                        href={links.ourModels}
                        icon={<ModelTrainingIcon />}
                        selected={curriedDoesMatchPath(links.ourModels)}
                        isExternalLink={true}>
                        OLMo Models
                    </NavigationLink>
                    <Divider />
                    <NavigationLink
                        href={links.datasetExplorer}
                        icon={<ExploreIcon />}
                        selected={
                            curriedDoesMatchPath(links.datasetExplorer) ||
                            curriedDoesMatchPath(links.search) ||
                            curriedDoesMatchPath(links.document(''))
                        }>
                        Dataset Explorer
                    </NavigationLink>
                    <NavigationLink
                        href={links.ourDatasets}
                        icon={<DatasetIcon />}
                        selected={curriedDoesMatchPath(links.ourDatasets)}
                        isExternalLink={true}>
                        Dolma Dataset
                    </NavigationLink>
                    <Divider sx={{ marginBlockStart: 'auto' }} />
                    <NavigationLink icon={<HelpCenterIcon />} href={links.faqs}>
                        FAQ
                    </NavigationLink>
                    <NavigationLink icon={<LogoutIcon />} href={links.logout}>
                        Log Out
                    </NavigationLink>
                </Stack>
            </Box>
        </ResponsiveDrawer>
    );
};

interface MobileHeadingProps {
    onClose?: () => void;
}

const MobileHeading = ({ onClose }: MobileHeadingProps): JSX.Element => {
    return (
        <Stack direction="row" justifyContent="space-between" paddingBlock={3} paddingInline={2}>
            <Typography
                variant="h4"
                component="span"
                m={0}
                color={(theme) => theme.palette.primary.main}>
                Menu
            </Typography>
            <IconButton aria-label="Close navigation drawer" onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Stack>
    );
};

const DesktopHeading = (): JSX.Element => {
    return (
        <Link paddingInline={2} paddingBlock={4} href="https://allenai.org">
            <logos.AI2Logo />
        </Link>
    );
};

interface TabletHeadingProps {
    toggleOpen: () => void;
    open?: boolean;
}

const TabletHeading = ({ toggleOpen, open }: TabletHeadingProps): JSX.Element => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingInlineStart={1}
            paddingInlineEnd={2}
            paddingBlock={4}
            gap={2}
            flexWrap="nowrap">
            <IconButton
                onClick={toggleOpen}
                title={`${open === true ? 'Collapse' : 'Expand'} navigation drawer`}>
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Link href="https://allenai.org" marginInlineStart="auto">
                <logos.AI2Logo includeText={false} />
            </Link>
        </Stack>
    );
};
