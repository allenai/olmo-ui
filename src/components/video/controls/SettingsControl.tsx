import { SettingsRounded } from '@mui/icons-material';
import { type Key, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import { ControlButton } from './ControlButton';

export const SettingsControl = ({
    menuItems,
    onAction,
}: {
    menuItems: Array<{ id: string; label: string }>;
    onAction: (key: Key) => void;
}) => {
    return (
        <MenuTrigger>
            <ControlButton>
                <SettingsRounded />
            </ControlButton>
            <Popover>
                <Menu items={menuItems} onAction={onAction}>
                    <MenuItem />
                </Menu>
            </Popover>
        </MenuTrigger>
    );
};
