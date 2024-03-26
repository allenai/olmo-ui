import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import { AppBar, Divider, Drawer, IconButton, List, Stack, Toolbar } from '@mui/material';
import { PropsWithChildren, useState } from 'react';

import { NavigationHeading } from './NavigationHeading';
import { NavigationLink } from './NavigationLink';

interface ResponsiveDrawerProps extends PropsWithChildren {
    isDrawerOpen?: boolean;
    handleDrawerClose?: () => void;
}

const DRAWER_BREAK_POINT = 'sm';

const ResponsiveDrawer = ({ children, isDrawerOpen, handleDrawerClose }: ResponsiveDrawerProps) => {
    return (
        <>
            <Drawer
                variant="temporary"
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                sx={{ display: { xs: 'flex', [DRAWER_BREAK_POINT]: 'none' } }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    paddingBlock={3}
                    paddingInline={2}>
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton aria-label="Close navigation drawer" onClick={handleDrawerClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                {children}
            </Drawer>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{ display: { xs: 'none', [DRAWER_BREAK_POINT]: 'flex' } }}>
                <Stack paddingInline={2} paddingBlock={4}>
                    <img src="/ai2-logo.png" alt="" height={33} width={292} />
                </Stack>
                {children}
            </Drawer>
        </>
    );
};

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
            <AppBar position="static" sx={{ backgroundColor: 'background.paper' }}>
                <Toolbar component={Stack} direction="row" justifyContent="space-between">
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <ResponsiveDrawer isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose}>
                <nav>
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
                </nav>
            </ResponsiveDrawer>
        </>
    );
};
