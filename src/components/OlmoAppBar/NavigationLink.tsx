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

interface NavigationLinkProps extends PropsWithChildren {
    icon: ReactNode;
    selected?: boolean;
    isExternalLink?: boolean;
    variant?: 'default' | 'footer';
    iconVariant?: 'internal' | 'external';
    href: string;
    onClick?: MouseEventHandler | KeyboardEventHandler;
}

export const NavigationLink = ({
    icon,
    children,
    href,
    selected,
    variant,
    iconVariant = 'internal',
}: NavigationLinkProps) => {
    return (
        <ListItem disableGutters>
            <ListItemButton
                component={Link}
                alignItems="center"
                selected={selected}
                disableGutters
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
                target={href.startsWith('/') ? '_self' : '_blank'}
                href={href}>
                <NavigationListItemIcon
                    sx={{ height: '1.25rem', widtH: '1.25rem', '& svg': { fontSize: '1.25rem' } }}>
                    {icon}
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: variant === 'default' ? 'h4' : 'body1',
                        component: 'span',
                        color: 'inherit',
                        fontWeight: 500,
                        // TODO: Put this back when we get semiBold added to varnish
                        // fontWeight: (theme) => theme.typography.fontWeightSemiBold,
                    }}>
                    {children}
                </ListItemText>
                <NavigationListItemIcon>
                    {iconVariant === 'external' ? (
                        <LaunchOutlinedIcon sx={{ fontSize: '1rem' }} />
                    ) : (
                        <img height={16} width={16} src="/chevron-ai2.svg" alt="" />
                    )}
                </NavigationListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
