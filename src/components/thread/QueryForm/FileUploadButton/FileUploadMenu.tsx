import { css } from '@allenai/varnish-panda-runtime/css';
import { Key, Menu, MenuItem, Popover } from 'react-aria-components';

import type { MediaTypeConfig, MediaTypeKey } from './fileUploadMediaConsts';

const menuItem = css({
    paddingBlock: '1',
    paddingInline: '5',
    cursor: 'pointer',
    _hover: {
        backgroundColor: 'background.opacity-4',
    },
});

const menu = css({
    display: 'grid',
    gap: '2',
    paddingBlock: '2',
    backgroundColor: 'elements.overrides.form.input.fill',
    borderRadius: 'sm',
    overflow: 'hidden',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.20)',
});

interface FileUploadMenuProps {
    mediaTypes: [MediaTypeKey, MediaTypeConfig][];
    onAction: (key: Key) => void;
}

export const FileUploadMenu = ({ mediaTypes, onAction }: FileUploadMenuProps) => {
    return (
        <Popover>
            <Menu className={menu} items={mediaTypes} onAction={onAction}>
                {([mediaType, mediaTypeConfig]) => (
                    <MenuItem className={menuItem} id={mediaType}>
                        Upload {mediaTypeConfig.label}s
                    </MenuItem>
                )}
            </Menu>
        </Popover>
    );
};
