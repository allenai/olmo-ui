import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { NavigationListItemIcon } from '@/components/OlmoAppBar/NavigationLink';

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
