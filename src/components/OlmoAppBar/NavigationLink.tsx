import { SvgIconComponent } from '@mui/icons-material';
import {
    ListItem,
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    ListItemText,
    SxProps,
    Theme,
} from '@mui/material';
import { ComponentProps, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';

export const NavigationListItemIcon = ({ sx, ...props }: ComponentProps<typeof ListItemIcon>) => (
    <ListItemIcon
        sx={[
            {
                color: 'inherit',
                minWidth: 'unset',
            },
            // Array.isArray doesn't preserve Sx's array type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
    />
);

type NavigationLinkProps = PropsWithChildren & {
    buttonId?: string;
    icon?: ReactNode;
    selected?: boolean;
    isExternalLink?: boolean;
    variant?: 'default' | 'footer';
    DisclosureIcon?: SvgIconComponent;
    inset?: boolean;
    dense?: boolean;
    linkProps?: Partial<ListItemButtonProps>;
    textSx?: SxProps<Theme>;
} & (
        | {
              href?: never;
              onClick?: MouseEventHandler<HTMLElement>;
          }
        | { href: string; onClick?: never }
    );

export const NavigationLink = ({
    icon,
    children,
    href,
    onClick,
    selected,
    variant = 'default',
    DisclosureIcon,
    inset,
    linkProps = {},
    textSx,
}: NavigationLinkProps) => {
    const isInternalLink = href != null && href.startsWith('/');

    const linkPropsMerged = {
        ...linkProps,
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
                selected={selected}
                disableGutters
                dense={variant === 'footer'}
                onClick={handleClick}
                sx={(theme) => ({
                    paddingBlock: 1,
                    paddingInline: 4,
                    gap: theme.spacing(2),
                    color: theme.palette.text.drawer.primary,

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
                    {/* We need something to take up space if this item is inset */}
                    {inset && icon == null && <div />}
                    {icon}
                </NavigationListItemIcon>
                <ListItemText
                    sx={textSx || { margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    {children}
                </ListItemText>
                <NavigationListItemIcon>
                    {DisclosureIcon ? (
                        <DisclosureIcon
                            sx={{
                                fontSize: '1rem',
                                opacity: 0.5,
                            }}
                        />
                    ) : null}
                </NavigationListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
