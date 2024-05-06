import { logos } from '@allenai/varnish2/components';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import ModelTrainingIcon from '@mui/icons-material/ModelTrainingOutlined';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import { Divider, IconButton, Link, List, Stack, Typography } from '@mui/material';
import { UIMatch, useMatches } from 'react-router-dom';

import { links } from '../../Links';
import { ResponsiveDrawer, ResponsiveDrawerProps } from '../ResponsiveDrawer';
import { NavigationFooter } from './NavigationFooter';
import { NavigationHeading } from './NavigationHeading';
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
            <Stack component="nav" direction="column" justifyContent="space-between" height={1}>
                <List>
                    <NavigationHeading>Models</NavigationHeading>
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
                        Our Models
                    </NavigationLink>
                    <Divider />
                    <NavigationHeading>Datasets</NavigationHeading>
                    <NavigationLink
                        href={links.datasetExplorer}
                        icon={<MagnifyingGlassIcon />}
                        selected={curriedDoesMatchPath(links.datasetExplorer)}>
                        Dataset Explorer
                    </NavigationLink>
                    <NavigationLink
                        href={links.ourDatasets}
                        icon={<DatasetIcon />}
                        selected={curriedDoesMatchPath(links.ourDatasets)}
                        isExternalLink={true}>
                        Our Datasets
                    </NavigationLink>
                </List>
                <NavigationFooter />
            </Stack>
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
