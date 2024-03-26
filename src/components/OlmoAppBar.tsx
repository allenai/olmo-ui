import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MagnifyingGlassIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
    AppBar,
    Divider,
    Drawer,
    Icon,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationLinkProps {
    icon: ReactNode;
    name: string;
    href: string;
}

const NavigationLink = ({ icon, name, href }: NavigationLinkProps) => {
    const location = useLocation();

    const isCurrentLocation = location.pathname.startsWith(href);

    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={isCurrentLocation}
                sx={{
                    gap: (theme) => theme.spacing(1),
                    '&.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                        '&:focus-visible,&:hover': {
                            backgroundColor: (theme) => theme.palette.primary.dark,
                        },
                    },
                }}
                component={Link}
                href={href}>
                <Icon>{icon}</Icon>
                <ListItemText
                    primaryTypographyProps={{ variant: 'h6', color: 'inherit', sx: { margin: 0 } }}>
                    {name}
                </ListItemText>
                <ChevronRightIcon sx={{ marginInlineStart: 'auto' }} />
            </ListItemButton>
        </ListItem>
    );
};

interface NavigationHeadingProps {
    headingText: string;
}
const NavigationHeading = ({ headingText }: NavigationHeadingProps) => {
    return (
        <ListSubheader sx={{ paddingBlock: 1.25 }}>
            <Typography variant="h6" margin={0} color="primary">
                {headingText}
            </Typography>
        </ListSubheader>
    );
};

export const OlmoAppBar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const handlerDrawerToggle = () => {
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
                    <IconButton onClick={handlerDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="temporary" open={isDrawerOpen} onClose={handleDrawerClose}>
                <Stack direction="row" justifyContent="space-between" padding={1}>
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton aria-label="Close navigation drawer" onClick={handleDrawerClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
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
            </Drawer>
        </>
    );
};
