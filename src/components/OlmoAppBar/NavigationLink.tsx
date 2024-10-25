import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ComponentProps, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

const NavigationListItemIcon = ({ sx, ...props }: ComponentProps<typeof ListItemIcon>) => (
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
    icon?: ReactNode;
    selected?: boolean;
    isExternalLink?: boolean;
    variant?: 'default' | 'footer';
    iconVariant?: 'internal' | 'external';
    inset?: boolean;
    dense?: boolean;
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
    iconVariant = 'internal',
    inset,
}: NavigationLinkProps) => {
    const linkProps =
        href == null
            ? {}
            : {
                  href,
                  target: href == null ? undefined : href.startsWith('/') ? '_self' : '_blank',
              };

    return (
        <ListItem disablePadding disableGutters dense>
            <ListItemButton
                alignItems="center"
                selected={selected}
                disableGutters
                dense={variant === 'footer'}
                onClick={onClick}
                sx={(theme) => ({
                    paddingBlock: 1,
                    paddingInline: 4,
                    gap: theme.spacing(2),
                    color: theme.palette.text.reversed,

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
                {...linkProps}>
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
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    {children}
                </ListItemText>
                <NavigationListItemIcon>
                    {iconVariant === 'external' && (
                        <LaunchOutlinedIcon
                            sx={{
                                fontSize: '1rem',
                                opacity: 0.5,
                            }}
                        />
                    )}
                </NavigationListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
