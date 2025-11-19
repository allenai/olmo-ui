import { css } from '@allenai/varnish-panda-runtime/css';
import { Key, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import type { MediaType } from './fileUploadMediaConsts';
import { AddMediaButton } from './AddMediaButton';

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

interface FileUploadMenuProps {
    triggerFileInput: (mediaType: string | number) => void;
    isDisabled?: boolean;
    mediaTypes: MediaType[];
};

export const FileUploadMenu = ({
    mediaTypes,
    isDisabled,
    triggerFileInput: handleMenuAction,
}: FileUploadMenuProps) => {
    return (
        <MenuTrigger>
            <AddMediaButton isDisabled={isDisabled} />
            <Popover>
                <Menu className={menu} items={mediaTypes} onAction={handleMenuAction}>
                    {(mediaType) => (
                        <MenuItem className={menuItem} id={mediaType.id}>
                            Upload {mediaType.label}s
                        </MenuItem>
                    )}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
};
