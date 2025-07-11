// Mobile-specific avatar menu using Popover, built on top of AvatarMenuBase.

import { Popover, PopoverProps } from '@mui/material';

import { AvatarMenuBase } from './AvatarMenuBase';

type AvatarMenuMobileProps = Pick<PopoverProps, 'anchorEl' | 'open' | 'sx'> & {
    onClose?: () => void;
};

export const AvatarMenuMobile = ({ anchorEl, open, onClose, sx }: AvatarMenuMobileProps) => {
    return (
        <AvatarMenuBase onClose={onClose} showEmail={false} showHeader themeModeAdaptive={false}>
            {(content) => (
                <Popover
                    data-testid="avatar-mobile-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={onClose}
                    sx={sx}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    slotProps={{
                        paper: {
                            sx: (theme) => ({
                                minWidth: '320px',
                                borderRadius: '16px',
                                boxShadow: `0px 4px 120px 0px alpha(${(theme.palette.common.black, 0.13)})`,
                            }),
                        },
                        root: {
                            sx: {
                                '& > .MuiModal-backdrop': {
                                    backdropFilter: 'blur(10px)',
                                },
                            },
                        },
                    }}>
                    {content}
                </Popover>
            )}
        </AvatarMenuBase>
    );
};
