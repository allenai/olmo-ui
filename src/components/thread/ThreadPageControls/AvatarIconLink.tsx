import { ArrowForwardIosOutlined } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';

import { useAppContext } from '@/AppContext';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { NavigationListItemIcon } from '@/components/OlmoAppBar/NavigationLink';

import { AvatarMenuMobile } from './AvatarMenuMobile';

export const AvatarIconLink = () => {
    const userInfo = useAppContext((state) => state.userInfo);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (anchorEl == null) {
            setAnchorEl(event.currentTarget);
        }

        setIsMenuOpen(!isMenuOpen);
    };

    const onAvatarMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <ListItem>
            <ListItemButton
                alignItems="center"
                disableGutters
                onClick={toggleMenu}
                sx={(theme) => ({
                    padding: theme.spacing(1.5),
                    gap: theme.spacing(2),
                    color: theme.palette.text.drawer.primary,
                    border: '2px solid rgba(255, 255, 255, 0.10)',
                    borderRadius: '28px',

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
                })}>
                <NavigationListItemIcon
                    sx={{
                        '& svg': { fontSize: '1.25rem' },
                        marginLeft: '2px',
                    }}>
                    <UserAvatar />
                </NavigationListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    {userInfo && userInfo.id}
                </ListItemText>
                <ArrowForwardIosOutlined
                    sx={{
                        fontSize: '1rem',
                        opacity: 0.5,
                    }}
                />
            </ListItemButton>
            <AvatarMenuMobile anchorEl={anchorEl} open={isMenuOpen} onClose={onAvatarMenuClose} />
        </ListItem>
    );
};
