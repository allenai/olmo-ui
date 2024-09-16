import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import {
    Icon,
    Link,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    SvgIcon,
} from '@mui/material';
import {
    ComponentProps,
    KeyboardEventHandler,
    MouseEventHandler,
    PropsWithChildren,
    ReactNode,
} from 'react';

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
              onClick?: MouseEventHandler | KeyboardEventHandler;
          }
        | { href: string; onClick?: never }
    );

export const NavigationLink = ({
    icon,
    children,
    href,
    selected,
    variant = 'default',
    iconVariant = 'internal',
    inset,
}: NavigationLinkProps) => {
    return (
        <ListItem disableGutters dense={variant === 'footer'}>
            <ListItemButton
                component={Link}
                alignItems="center"
                selected={selected}
                disableGutters
                dense={variant === 'footer'}
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
                target={href == null ? undefined : href.startsWith('/') ? '_self' : '_blank'}
                href={href}>
                <NavigationListItemIcon
                    sx={{ height: '1.25rem', width: '1.25rem', '& svg': { fontSize: '1.25rem' } }}>
                    {/* We need something to take up space if this item is inset */}
                    {inset && icon == null && <div />}
                    {icon}
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: variant === 'default' ? 'h4' : 'body1',
                        component: 'span',
                    }}>
                    {children}
                </ListItemText>
                <NavigationListItemIcon>
                    {iconVariant === 'external' && <LaunchOutlinedIcon sx={{ fontSize: '1rem' }} />}
                </NavigationListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
