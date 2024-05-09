import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Icon, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

interface NavigationLinkProps extends PropsWithChildren {
    icon: ReactNode;
    href: string;
    selected?: boolean;
    isExternalLink?: boolean;
}

export const NavigationLink = ({
    icon,
    children,
    href,
    selected,
    isExternalLink,
}: NavigationLinkProps) => {
    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={selected}
                sx={{
                    gap: (theme) => theme.spacing(2),
                }}
                target={isExternalLink ? '_blank' : '_self'}
                href={href}>
                <Icon>{icon}</Icon>
                <ListItemText
                    primaryTypographyProps={{ variant: 'h6', color: 'inherit', sx: { margin: 0 } }}>
                    {children}
                </ListItemText>
                {isExternalLink ? (
                    <LaunchOutlinedIcon sx={{ marginInlineStart: 'auto' }} />
                ) : (
                    <ChevronRightIcon sx={{ marginInlineStart: 'auto' }} />
                )}
            </ListItemButton>
        </ListItem>
    );
};
