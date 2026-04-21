import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { NavigationListItemIcon } from '@/components/OlmoAppBar/NavigationLink';

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
                  target: isInternalLink ? '_self' : '_blank',
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
                        color: theme.vars.palette.secondary.main,

                        ':hover': {
                            backgroundColor: 'transparent',
                        },

                        ':focus-visible': {
                            backgroundColor: theme.vars.palette.secondary.light,
                            color: theme.vars.palette.secondary.contrastText,
                        },
                    },

                    '&.Mui-focusVisible': {
                        backgroundColor: theme.vars.palette.secondary.light,
                        color: theme.vars.palette.secondary.contrastText,
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
                        color: 'inherit',
                    }}>
                    {icon}
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    slotProps={{
                        primary: {
                            variant: 'body1',
                            fontWeight: 500,
                            component: 'span',
                        },
                    }}>
                    {children}
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
};
