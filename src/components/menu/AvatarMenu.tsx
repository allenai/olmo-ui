// Desktop-specific avatar menu using Popper, built on top of AvatarMenuBase.

import type { PopperOwnProps } from '@mui/base';
import type { SxProps, Theme } from '@mui/material';
import { Popper } from '@mui/material';

import { AvatarMenuBase } from './AvatarMenuBase';

type AvatarMenuProps = Pick<PopperOwnProps, 'anchorEl' | 'placement'> & {
    sx?: SxProps<Theme>;
};

export const AvatarMenu = ({ anchorEl, placement, sx }: AvatarMenuProps) => {
    return (
        <AvatarMenuBase>
            {(content) => (
                <Popper
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    placement={placement}
                    sx={sx}
                    data-testid="avatar-menu">
                    {content}
                </Popper>
            )}
        </AvatarMenuBase>
    );
};
