import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

interface NavigationLinkProps extends PropsWithChildren {
    icon: ReactNode;
    href: string;
    selected?: boolean;
}

export const NavigationLink = ({ icon, children, href, selected }: NavigationLinkProps) => {
    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={selected}
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
