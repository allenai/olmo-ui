import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import { AppBar, Divider, IconButton, List, Stack, Toolbar } from '@mui/material';
import { useState } from 'react';

import { NavDrawer } from './NavDrawer';
import { NavigationFooter } from './NavigationFooter';
import { NavigationHeading } from './NavigationHeading';
import { NavigationLink } from './NavigationLink';

export const OlmoAppBar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

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
                }}>
                <Toolbar component={Stack} direction="row" justifyContent="space-between">
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
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
