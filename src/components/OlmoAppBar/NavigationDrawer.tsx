import { LoginOutlined as LoginIcon } from '@mui/icons-material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import HelpCenterIcon from '@mui/icons-material/HelpCenterOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import ModelTrainingIcon from '@mui/icons-material/ModelTrainingOutlined';
import { Box, IconButton, Link, List, Stack } from '@mui/material';
import { ComponentProps, useEffect } from 'react';
import { UIMatch, useMatches } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { links } from '@/Links';

import { Ai2LogoFull } from '../Ai2LogoFull';
import { ResponsiveDrawer } from '../ResponsiveDrawer';
import { NavigationLink } from './NavigationLink';

const Auth0LoginLink = () => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return (
            <NavigationLink icon={<LogoutIcon />} href={links.logout} variant="footer">
                Log Out
            </NavigationLink>
        );
    }

    return (
        <NavigationLink
            icon={<LoginIcon />}
            href={links.login(window.location.href)}
            variant="footer">
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
            desktopDrawerSx={{ gridArea: 'nav' }}>
            <Stack component="nav" sx={{ height: 1, overflowX: 'hidden', paddingInline: 4 }}>
                <NavigationLink
                    href={links.playground}
                    icon={<img alt="" src="/chat.svg" />}
                    selected={curriedDoesMatchPath(links.playground, links.thread(''))}>
                    Playground
                </NavigationLink>
                <NavigationLink
                    href={links.ourModels}
                    icon={<ModelTrainingIcon />}
                    selected={curriedDoesMatchPath(links.ourModels)}
                    iconVariant="external">
                    OLMo Models
                </NavigationLink>
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
                    iconVariant="external">
                    Dolma Dataset
                </NavigationLink>
                <Box marginBlockStart="auto" id="nav-footer">
                    <NavigationLink icon={<HelpCenterIcon />} href={links.faqs} variant="footer">
                        FAQ
                    </NavigationLink>
                    <Auth0LoginLink />
                </Box>
            </Stack>
        </ResponsiveDrawer>
    );
};

interface MobileHeadingProps {
    onClose?: () => void;
}

const MobileHeading = ({ onClose }: MobileHeadingProps): JSX.Element => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            paddingBlock={4}
            paddingInline={4}
            alignItems="center">
            <Link href={links.home}>
                <Ai2LogoFull width={97.3} height={30} alt="Return to the Playground home page" />
            </Link>
            <IconButton
                aria-label="Close navigation drawer"
                onClick={onClose}
                edge="end"
                sx={{ color: (theme) => theme.palette.tertiary.main }}>
                <CloseIcon />
            </IconButton>
        </Stack>
    );
};

const DesktopHeading = (): JSX.Element => {
    return (
        <Link paddingInline={2} paddingBlock={4} href={links.home}>
            <Ai2LogoFull width={97.3} height={30} alt="Return to the Playground home page" />
        </Link>
    );
};
