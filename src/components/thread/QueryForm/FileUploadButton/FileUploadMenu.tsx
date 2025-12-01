import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import { menuClassName, menuItemClassName } from '@/components/menu/sharedMenuStyles';

import { AddMediaButton } from './AddMediaButton';
import type { MediaType } from './fileUploadMediaConsts';

interface FileUploadMenuProps {
    triggerFileInput: (mediaType: string | number) => void;
    isDisabled?: boolean;
    mediaTypes: MediaType[];
}

export const FileUploadMenu = ({
    mediaTypes,
    isDisabled,
    triggerFileInput: handleMenuAction,
}: FileUploadMenuProps) => {
    return (
        <MenuTrigger>
            <AddMediaButton isDisabled={isDisabled} aria-label="Choose type of files" />
            <Popover>
                <Menu className={menuClassName} items={mediaTypes} onAction={handleMenuAction}>
                    {(mediaType) => (
                        <MenuItem className={menuItemClassName} id={mediaType.id}>
                            Upload {mediaType.label}s
                        </MenuItem>
                    )}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
};
