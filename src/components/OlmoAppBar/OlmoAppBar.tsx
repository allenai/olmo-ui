import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import { AppBar, Divider, IconButton, List, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import { useMatches } from 'react-router-dom';

import { DesktopLayoutBreakpoint } from '../../constants';

import { NavDrawer } from './NavDrawer';
import { NavigationFooter } from './NavigationFooter';
import { NavigationHeading } from './NavigationHeading';
import { NavigationLink } from './NavigationLink';

interface HandleWithTitle {
    title: string;
}

const useRouteTitle = () => {
    const matches = useMatches();
    const titles = matches
        .filter((match) => Boolean(match.handle) && (match.handle as HandleWithTitle).title != null)
        .map((match) => (match.handle as HandleWithTitle).title);

    const lowestTitle = titles[titles.length - 1];

    return lowestTitle;
};

export const OlmoAppBar = () => {
    const title = useRouteTitle();
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
                color="transparent"
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
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                            margin: 0,
                            display: { xs: 'none', [DesktopLayoutBreakpoint]: 'block' },
                        }}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            display: { [DesktopLayoutBreakpoint]: 'none' },
                            marginInlineStart: 'auto',
                        }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <NavDrawer open={isDrawerOpen} onClose={handleDrawerClose}>
                <Stack component="nav" direction="column" justifyContent="space-between" height="1">
                    <List>
                        <NavigationHeading headingText="Models" />
                        <NavigationLink href="/" icon={<ChatBubbleIcon />} name="Playground" />
                        <NavigationLink href="/models" icon={<InfoIcon />} name="Our Models" />
                        <Divider />
                        <NavigationHeading headingText="Datasets" />
                        <NavigationLink
                            href="/dolma"
                            icon={<MagnifyingGlassIcon />}
                            name="Dataset Explorer"
                        />
                        <NavigationLink
                            href="/dolma/datasets"
                            icon={<InfoIcon />}
                            name="Our Datasets"
                        />
                    </List>
                    <NavigationFooter />
                </Stack>
            </NavDrawer>
        </>
    );
};
