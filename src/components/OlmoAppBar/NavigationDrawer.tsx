import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, Link, List, Stack, Typography } from '@mui/material';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import ModelTrainingIcon from '@mui/icons-material/ModelTrainingOutlined';

import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';

import { logos } from '@allenai/varnish2/components';

import { UIMatch, useMatches } from 'react-router-dom';

import HelpCenterIcon from '@mui/icons-material/HelpCenterOutlined';

import LogoutIcon from '@mui/icons-material/LogoutOutlined';

import { links } from '@/Links';

import { ResponsiveDrawer, ResponsiveDrawerProps } from '../ResponsiveDrawer';
import { NavigationLink } from './NavigationLink';

const doesMatchPath = (match: UIMatch, ...paths: string[]) => {
    return paths.some((path) => {
        if (path.length === 1) {
            return match.pathname === path;
        }

        return match.pathname.startsWith(path);
    });
};

interface NavigationDrawerProps extends Omit<ResponsiveDrawerProps, 'children'> {
    onClose?: () => void;
}

export const NavigationDrawer = ({ onClose, ...props }: NavigationDrawerProps): JSX.Element => {
    const matches = useMatches();
    const deepestMatch = matches[matches.length - 1];

    const curriedDoesMatchPath = (...paths: string[]) => doesMatchPath(deepestMatch, ...paths);

    return (
        <ResponsiveDrawer
            {...props}
            onClose={onClose}
            mobileHeading={<MobileHeading onClose={onClose} />}
            heading={<DesktopHeading />}
            desktopDrawerSx={{ gridArea: 'nav' }}>
            <Box component="nav" sx={{ height: 1 }}>
                <Stack component={List} flexGrow={1} direction="column" sx={{ height: 1 }}>
                    <NavigationLink
                        href={links.playground}
                        icon={<ChatBubbleIcon />}
                        selected={curriedDoesMatchPath(links.playground, links.thread(''))}>
                        Playground
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
                        selected={curriedDoesMatchPath(links.datasetExplorer)}>
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
                    <NavigationLink icon={<LogoutIcon />} href={links.logOut}>
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
