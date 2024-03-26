import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Icon, Link, ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationLinkProps {
    icon: ReactNode;
    name: string;
    href: string;
}
export const NavigationLink = ({ icon, name, href }: NavigationLinkProps) => {
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
