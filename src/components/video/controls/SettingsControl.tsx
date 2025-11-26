import { SettingsRounded } from '@mui/icons-material';
import { memo } from 'react';
import { type Key, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import { menuClassName, menuItemClassName } from '@/components/menu/sharedMenuStyles';

import { ControlButton } from './ControlButton';

export const SettingsControl = memo(function SettingsControl({
    menuItems,
    onAction,
}: {
    menuItems: Array<{ id: string; label: string }>;
    onAction: (key: Key) => void;
}) {
    return (
        <MenuTrigger>
            <ControlButton>
                <SettingsRounded />
            </ControlButton>
            <Popover placement="top">
                <Menu items={menuItems} onAction={onAction} className={menuClassName}>
                    {({ id, label }) => (
                        <MenuItem className={menuItemClassName} key={id} id={id}>
                            {label}
                        </MenuItem>
                    )}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
});
