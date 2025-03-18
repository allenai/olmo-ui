import { IconButton } from '@mui/material';
import React from 'react';

import { UserAvatar } from '@/components/avatars/UserAvatar';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { AvatarMenu } from '../../menu/AvatarMenu';

export const AvatarMenuIconButton = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl == null ? event.currentTarget : null);
    };

    return (
        <IconButton
            sx={(theme) => ({
                padding: 0.7,
                [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    display: 'none',
                },
            })}
            onClick={toggleMenu}>
            <UserAvatar />
            <AvatarMenu
                anchorEl={anchorEl}
                placement="left"
                sx={(theme) => ({
                    top: '15px!important',
                    right: '40px!important',
                    [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        display: 'none',
                    },
                })}
            />
        </IconButton>
    );
};
