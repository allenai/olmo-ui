import { Check } from '@mui/icons-material';
import TVOutlinedIcon from '@mui/icons-material/TvOutlined';
import type { MenuItemProps } from '@mui/material';
import { Box, ListItemIcon, Menu, MenuItem, useColorScheme } from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { NavigationLink } from './NavigationLink';

// We need the autoFocus prop from MenuItemProps so the MenuList can automatically focus the right item
// Including all the props just in case we need something else
interface ColorModeSelectionMenuItemProps extends MenuItemProps {
    title: string;
    mode: 'light' | 'dark' | 'system';
}

const ColorModeSelectionMenuItem = ({
    title,
    mode,
    onClick,
    ...menuItemProps
}: ColorModeSelectionMenuItemProps): ReactNode => {
    const { mode: muiMode, setMode } = useColorScheme();
    const isSelected = mode === muiMode;

    return (
        <MenuItem
            {...menuItemProps}
            onClick={(e) => {
                analyticsClient.trackColorModeChange({ colorMode: mode });
                setMode(mode);
                onClick?.(e);
            }}>
            <Box flexGrow={1}>{title}</Box>
            {isSelected ? (
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
};

export const ColorModeSelection = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = () => {
        handleClose();
    };

    const handleAppearanceButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <NavigationLink
                onClick={handleAppearanceButtonClick}
                icon={<TVOutlinedIcon />}
                inset
                linkProps={{
                    id: 'appearance-menu-button',
                    'aria-controls': 'appearance-menu',
                    'aria-haspopup': 'listbox',
                    'aria-expanded': open ? 'true' : undefined,
                }}>
                Appearance
            </NavigationLink>
            <Menu
                id="appearance-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                variant="menu"
                MenuListProps={{
                    dense: true,
                    disablePadding: true,
                    'aria-labelledby': 'appearance-menu-button',
                    role: 'listbox',
                }}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
                slotProps={{
                    paper: {
                        style: {
                            minWidth: '12rem',
                        },
                    },
                }}>
                <ColorModeSelectionMenuItem
                    title="System"
                    mode="system"
                    onClick={handleMenuItemClick}
                />
                <ColorModeSelectionMenuItem
                    title="Light"
                    mode="light"
                    onClick={handleMenuItemClick}
                />
                <ColorModeSelectionMenuItem
                    title="Dark"
                    mode="dark"
                    onClick={handleMenuItemClick}
                />
            </Menu>
        </>
    );
};
