import { PopperOwnProps } from '@mui/base';
import { ShieldOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import {
    Box,
    IconButton,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    Popover,
    PopoverProps,
    Popper,
    Stack,
    SxProps,
    Theme,
    Typography,
} from '@mui/material';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { NavigationListItemIcon } from '@/components/OlmoAppBar/NavigationLink';
import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';
import { links } from '@/Links';

const Auth0LoginLink = ({ themeModeAdaptive = true }: { themeModeAdaptive?: boolean }) => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return (
            <AvatarMenuItem
                icon={<LogoutIcon />}
                href={links.logout}
                themeModeAdaptive={themeModeAdaptive}>
                Log out
            </AvatarMenuItem>
        );
    }

    return (
        <AvatarMenuItem
            // eslint-disable-next-line react/jsx-no-undef
            icon={<LoginIcon />}
            href={links.login(window.location.href)}
            themeModeAdaptive={themeModeAdaptive}>
            Log in
        </AvatarMenuItem>
    );
};

type AvatarMenuProps = Pick<PopperOwnProps, 'anchorEl' | 'placement'> & {
    sx?: SxProps<Theme>;
};

export const AvatarMenu = ({ anchorEl, placement, sx }: AvatarMenuProps) => {
    return (
        <>
            <Popper
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                placement={placement}
                sx={sx}
                data-test-id="avatar-menu">
                <Box
                    sx={(theme) => ({
                        p: 2.5,
                        borderRadius: '16px',
                        bgcolor:
                            theme.palette.mode === 'light'
                                ? theme.palette.background.default
                                : theme.palette.background.drawer.primary,
                        boxShadow: `0px 4px 60px 0px alpha(${(theme.palette.common.black, 0.15)})`,
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

type AvatarMenuMobileProps = Pick<PopoverProps, 'anchorEl' | 'open' | 'sx'> & {
    onClose?: () => void;
};

export const AvatarMenuMobile = ({ anchorEl, open, onClose, sx }: AvatarMenuMobileProps) => {
    const closeMenu = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Popover
            id="avatar-mobile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            sx={sx}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            slotProps={{
                paper: {
                    sx: (theme) => ({
                        minWidth: '320px',
                        borderRadius: '16px',
                        boxShadow: `0px 4px 120px 0px alpha(${(theme.palette.common.black, 0.13)})`,
                    }),
                },
                root: {
                    sx: {
                        '& > .MuiModal-backdrop': {
                            backdropFilter: 'blur(10px)',
                        },
                    },
                },
            }}>
            <Box
                sx={(theme) => ({
                    p: 2.5,
                    bgcolor: theme.palette.background.drawer.primary,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                })}>
                <Stack direction="row" gap={2} mb={2}>
                    <UserAvatar />
                    <Typography
                        component="span"
                        variant="body1"
                        sx={(theme) => ({
                            fontWeight: 500,
                            alignSelf: 'center',
                            color: theme.palette.common.white,
                        })}>
                        Preferences
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={closeMenu}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing(2),
                            top: theme.spacing(2),
                            color: theme.palette.grey[500],
                        })}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <ThemeModeSelect themeModeAdaptive={false} />
                {process.env.IS_ANALYTICS_ENABLED === 'true' && (
                    <AvatarMenuItem
                        icon={<ShieldOutlined />}
                        onClick={() => {
                            window.Osano?.cm?.showDrawer();
                        }}
                        themeModeAdaptive={false}>
                        Privacy settings
                    </AvatarMenuItem>
                )}
                <Auth0LoginLink themeModeAdaptive={false} />
            </Box>
        </Popover>
    );
};

type AvatarMenuItemProps = PropsWithChildren & {
    icon?: ReactNode;
    themeModeAdaptive?: boolean;
} & (
        | {
              href?: never;
              onClick?: MouseEventHandler<HTMLElement>;
          }
        | { href: string; onClick?: never }
    );

export const AvatarMenuItem = ({
    icon,
    themeModeAdaptive = true,
    children,
    href,
    onClick,
}: AvatarMenuItemProps) => {
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
                        color: (theme) => {
                            return themeModeAdaptive ? 'inherit' : theme.palette.common.white;
                        },
                    }}>
                    {icon}
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                        sx: (theme) => {
                            return themeModeAdaptive
                                ? {}
                                : {
                                      color: theme.palette.common.white,
                                  };
                        },
                    }}>
                    {children}
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
};
