import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import { AppBar, Divider, Drawer, IconButton, List, ListItem, Stack, Toolbar } from '@mui/material';
import { PropsWithChildren, useState } from 'react';

import { Link } from 'react-router-dom';

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
                sx={{ display: { xs: 'flex', [DRAWER_BREAK_POINT]: 'none', width: '100vw' } }}>
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
                // anchor="left"
                sx={{
                    width: 'auto',
                    display: { xs: 'none', [DRAWER_BREAK_POINT]: 'flex' },

                    gridArea: 'nav',
                    '.MuiDrawer-paper': {
                        // width: (theme) => theme.spacing(40),
                        boxSizing: 'border-box',
                        position: 'unset',
                    },
                }}>
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
            <AppBar
                position="static"
                sx={{
                    backgroundColor: (theme) => theme.palette.background.paper,
                    zIndex: {
                        sm: (theme) => theme.zIndex.drawer + 1,
                    },
                    gridArea: 'app-bar',
                }}>
                <Toolbar component={Stack} direction="row" justifyContent="space-between">
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <ResponsiveDrawer isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose}>
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
                    <List sx={{ marginBlockStart: 'auto' }}>
                        <ListItem>
                            <Link to="/feedback">Give Feedback</Link>
                        </ListItem>
                        <ListItem>
                            <Link to="/faqs">FAQs</Link>
                        </ListItem>
                        <ListItem>
                            <Link to="/data-policy">Data Policy</Link>
                        </ListItem>
                        <ListItem>
                            <Link to="/log-out">Log Out</Link>
                        </ListItem>
                    </List>
                </Stack>
            </ResponsiveDrawer>
        </>
    );
};
