import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Link as ReactRouterLink, useMatches } from 'react-router-dom';

interface NavigationLinkProps extends PropsWithChildren {
    icon: ReactNode;
    href: string;
}

export const NavigationLink = ({ icon, children, href }: NavigationLinkProps) => {
    const matches = useMatches();

    const isCurrentLocation = matches[matches.length - 1].pathname === href;

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
                component={ReactRouterLink}
                to={href}>
                <Icon>{icon}</Icon>
                <ListItemText
                    primaryTypographyProps={{ variant: 'h6', color: 'inherit', sx: { margin: 0 } }}>
                    {children}
                </ListItemText>
                <ChevronRightIcon sx={{ marginInlineStart: 'auto' }} />
            </ListItemButton>
        </ListItem>
    );
};
