import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Icon, Link, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { KeyboardEventHandler, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

interface NavigationLinkProps extends PropsWithChildren {
    icon: ReactNode;
    selected?: boolean;
    isExternalLink?: boolean;
    variant?: 'internal' | 'external';
    href: string;
    onClick?: MouseEventHandler | KeyboardEventHandler;
}

export const NavigationLink = ({
    icon,
    children,
    href,
    selected,
    variant = 'internal',
}: NavigationLinkProps) => {
    return (
        <ListItem disableGutters>
            <ListItemButton
                component={Link}
                alignItems="center"
                selected={selected}
                sx={(theme) => ({
                    gap: theme.spacing(2),
                    color: theme.palette.common.white,

                    '&.Mui-selected': {
                        backgroundColor: 'transparent',
                        color: theme.palette.tertiary.main,

                        ':focus-visible': {
                            backgroundColor: theme.palette.tertiary.light,
                            color: theme.palette.tertiary.contrastText,
                        },
                    },

                    '&.Mui-focusVisible': {
                        backgroundColor: theme.palette.tertiary.light,
                        color: theme.palette.tertiary.contrastText,
                    },
                })}
                target={variant === 'external' ? '_blank' : '_self'}
                href={href}>
                <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                <ListItemText
                    primaryTypographyProps={{
                        variant: 'h4',
                        component: 'span',
                        color: 'inherit',
                        sx: { margin: 0 },
                    }}>
                    {children}
                </ListItemText>
                <ListItemIcon sx={{ color: 'inherit' }}>
                    {variant === 'external' ? (
                        <LaunchOutlinedIcon sx={{ marginInlineStart: 'auto' }} />
                    ) : (
                        <ChevronRightIcon sx={{ marginInlineStart: 'auto' }} />
                    )}
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
