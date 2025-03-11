import { ShieldOutlined } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { Box, IconButton, ListItem, ListItemButton, ListItemText, Popper } from '@mui/material';
import React, { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { NavigationListItemIcon } from '@/components/OlmoAppBar/NavigationLink';
import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';
import { links } from '@/Links';

const Auth0LoginLink = () => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return (
            <AvatarMenuItem icon={<LogoutIcon />} href={links.logout}>
                Log out
            </AvatarMenuItem>
        );
    }

    return (
        <AvatarMenuItem
            // eslint-disable-next-line react/jsx-no-undef
            icon={<LoginIcon />}
            href={links.login(window.location.href)}>
            Log in
        </AvatarMenuItem>
    );
};

export const AvatarMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl == null ? event.currentTarget : null);
    };

    return (
        <>
            <IconButton sx={{ padding: 0.7 }} onClick={toggleMenu}>
                <UserAvatar />
            </IconButton>
            <Popper
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                placement="left"
                sx={{
                    top: '15px!important',
                    right: '40px!important',
                }}>
                <Box
                    sx={(theme) => ({
                        p: 2.5,
                        borderRadius: '16px',
                        bgcolor:
                            theme.palette.mode === 'light'
                                ? theme.palette.background.default
                                : theme.palette.background.drawer.primary,
                        boxShadow: '0px 4px 60px 0px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    })}>
                    <ThemeModeSelect />
                    {process.env.IS_ANALYTICS_ENABLED === 'true' && (
                        <AvatarMenuItem
                            icon={<ShieldOutlined />}
                            onClick={() => {
                                window.Osano?.cm?.showDrawer();
                            }}>
                            Privacy settings
                        </AvatarMenuItem>
                    )}
                    <Auth0LoginLink />
                </Box>
            </Popper>
        </>
    );
};

type AvatarMenuItemProps = PropsWithChildren & {
    icon?: ReactNode;
} & (
        | {
              href?: never;
              onClick?: MouseEventHandler<HTMLElement>;
          }
        | { href: string; onClick?: never }
    );

export const AvatarMenuItem = ({ icon, children, href, onClick }: AvatarMenuItemProps) => {
    const isInternalLink = href != null && href.startsWith('/');

    const linkPropsMerged = {
        ...(href == null
            ? {}
            : {
                  href,
                  target: href == null ? undefined : isInternalLink ? '_self' : '_blank',
              }),
    };

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
        if (href != null && !isInternalLink) {
            analyticsClient.trackExternalNavigationLinkClick({ url: href });
        }

        onClick?.(event);
    };

    return (
        <ListItem disablePadding dense>
            <ListItemButton
                alignItems="center"
                disableGutters
                onClick={handleClick}
                sx={(theme) => ({
                    paddingBlock: 1,
                    gap: theme.spacing(2),

                    ':hover': {
                        backgroundColor: 'transparent',
                    },

                    '&.Mui-selected': {
                        backgroundColor: 'transparent',
                        color: theme.palette.secondary.main,

                        ':hover': {
                            backgroundColor: 'transparent',
                        },

                        ':focus-visible': {
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.secondary.contrastText,
                        },
                    },

                    '&.Mui-focusVisible': {
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.contrastText,
                    },
                })}
                {...linkPropsMerged}>
                <NavigationListItemIcon
                    sx={{
                        height: '1.25rem',
                        width: '1.25rem',
                        '& svg': { fontSize: '1.25rem' },
                        opacity: 0.5,
                        '.Mui-selected &, &.Mui-focusVisible': { opacity: 1 },
                    }}>
                    {icon}
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    {children}
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
};
