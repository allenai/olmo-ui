import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, Link, List, Stack, Typography } from '@mui/material';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import ModelTrainingIcon from '@mui/icons-material/ModelTrainingOutlined';

import DatasetIcon from '@mui/icons-material/DatasetOutlined';

import MagnifyingGlassIcon from '@mui/icons-material/Search';

import { NavigationFooter } from './NavigationFooter';
import { NavigationHeading } from './NavigationHeading';
import { NavigationLink } from './NavigationLink';
import { ResponsiveDrawer, ResponsiveDrawerProps } from '../ResponsiveDrawer';

interface NavigationDrawerProps extends Omit<ResponsiveDrawerProps, 'children'> {
    onClose?: () => void;
}

export const NavigationDrawer = ({ onClose, ...props }: NavigationDrawerProps): JSX.Element => {
    return (
        <ResponsiveDrawer
            {...props}
            onClose={onClose}
            mobileHeading={<MobileHeading onClose={onClose} />}
            desktopHeading={<DesktopHeading />}>
            <Stack component="nav" direction="column" justifyContent="space-between" height="1">
                <List>
                    <NavigationHeading>Models</NavigationHeading>
                    <NavigationLink href="/" icon={<ChatBubbleIcon />}>
                        Playground
                    </NavigationLink>
                    <NavigationLink href="/models" icon={<ModelTrainingIcon />}>
                        Our Models
                    </NavigationLink>
                    <Divider />
                    <NavigationHeading>Datasets</NavigationHeading>
                    <NavigationLink href="/dolma" icon={<MagnifyingGlassIcon />}>
                        Dataset Explorer
                    </NavigationLink>
                    <NavigationLink href="/dolma/datasets" icon={<DatasetIcon />}>
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
            <img src="/ai2-logo.png" alt="Go to the AI2 homepage" height={33} width={292} />
        </Link>
    );
};
