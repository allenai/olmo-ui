import LoginIcon from '@mui/icons-material/LoginOutlined';
import { alpha, ListItem, ListItemButton, ListItemText } from '@mui/material';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { NavigationListItemIcon } from '@/components/OlmoAppBar/NavigationLink';
import { links } from '@/Links';

export const LoginLink = () => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return null;
    }

    return (
        <ListItem disablePadding dense>
            <ListItemButton
                alignItems="center"
                disableGutters
                href={links.login(window.location.href)}
                sx={(theme) => ({
                    minHeight: theme.spacing(5),
                    marginInline: theme.spacing(2),
                    marginBlockEnd: theme.spacing(1),
                    paddingBlock: theme.spacing(2),
                    paddingInline: theme.spacing(2),
                    gap: theme.spacing(2),
                    color: theme.color['cream-100'].hex,
                    borderRadius: '28px',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),

                    ':hover, :hover > &': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },

                    '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        color: theme.palette.secondary.main,

                        ':hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.1),
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
                })}>
                <NavigationListItemIcon
                    sx={{
                        '& svg': { fontSize: '1.25rem' },
                        marginLeft: '2px',
                        opacity: 0.5,
                    }}>
                    <LoginIcon />
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    Log in
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
};
