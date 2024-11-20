import { Check } from '@mui/icons-material';
import TVOutlinedIcon from '@mui/icons-material/TvOutlined';
import { Box, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import { ColorPreference, useColorMode } from '../ColorModeProvider';
import { NavigationLink } from './NavigationLink';

interface ColorModeSelectionMenuItemProps {
    title: string;
    name: ColorPreference;
}

export const ColorModeSelection = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [colorMode, setColorMode] = useColorMode();
    const open = Boolean(anchorEl);

    const changeColorMode = (mode: ColorPreference) => {
        setColorMode(mode);
        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const ColorModeSelectionMenuItem = ({ title, name }: ColorModeSelectionMenuItemProps) => (
        <MenuItem
            onClick={() => {
                changeColorMode(name);
            }}>
            <Box flexGrow={1}>{title}</Box>
            {colorMode === name ? (
                <ListItemIcon
                    sx={{
                        flexDirection: 'row-reverse',
                        justifySelf: 'end',
                    }}>
                    <Check />
                </ListItemIcon>
            ) : null}
        </MenuItem>
    );

    return (
        <>
            <NavigationLink
                onClick={onClick}
                icon={<TVOutlinedIcon />}
                inset
                linkProps={{
                    id: 'appearance-menu-button',
                    'aria-controls': open ? 'appearance-menu' : undefined,
                    'aria-haspopup': true,
                    'aria-expanded': open ? 'true' : undefined,
                }}>
                Appearance
            </NavigationLink>
            <Menu
                id="appearance-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    dense: true,
                    disablePadding: true,
                    'aria-labelledby': 'appearance-menu-button',
                }}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
                PaperProps={{
                    style: {
                        width: '12rem',
                    },
                }}>
                <ColorModeSelectionMenuItem title="System" name="system" />
                <ColorModeSelectionMenuItem title="Light" name="light" />
                <ColorModeSelectionMenuItem title="Dark" name="dark" />
            </Menu>
        </>
    );
};
