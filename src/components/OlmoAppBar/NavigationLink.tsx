import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Icon, Link, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

type NavigationLinkProps = PropsWithChildren & {
    icon: ReactNode;
    selected?: boolean;
    isExternalLink?: boolean;
} & ({ href: string; onClick?: never } | { href?: never; onClick: MouseEventHandler });

export const NavigationLink = ({
    icon,
    children,
    href,
    onClick,
    selected,
    isExternalLink,
}: NavigationLinkProps) => {
    return (
        <ListItem disableGutters>
            <ListItemButton
                component={Link}
                alignItems="center"
                selected={selected}
                sx={{
                    gap: (theme) => theme.spacing(2),
                }}
                target={isExternalLink ? '_blank' : '_self'}
                href={href}
                onClick={onClick}>
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
