import { css } from '@allenai/varnish-panda-runtime/css';
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
                <Menu items={menuItems} onAction={onAction} className={menu}>
                    {({ id, label }) => (
                        <MenuItem className={menuItem} key={id} id={id}>
                            {label}
                        </MenuItem>
                    )}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
};

const menuItem = css({
    paddingBlock: '1',
    paddingInline: '5',
    cursor: 'pointer',
    _hover: {
        backgroundColor: 'background.opacity-4',
    },
    outline: 'none',
});

const menu = css({
    display: 'grid',
    gap: '2',
    paddingBlock: '2',
    backgroundColor: 'elements.overrides.form.input.fill',
    borderRadius: 'sm',
    overflow: 'hidden',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.20)',
    outline: 'none',
});
