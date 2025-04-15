import { ShieldOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Popover, PopoverProps, Stack, Typography } from '@mui/material';

import { UserAvatar } from '@/components/avatars/UserAvatar';
import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';

import { Auth0LoginLink } from './Auth0LoginLink';
import { AvatarMenuItem } from './AvatarMenuItem';

type AvatarMenuMobileProps = Pick<PopoverProps, 'anchorEl' | 'open' | 'sx'> & {
    onClose?: () => void;
};

export const AvatarMenuMobile = ({ anchorEl, open, onClose, sx }: AvatarMenuMobileProps) => {
    const closeMenu = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Popover
            data-testid="avatar-mobile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
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
            <Box
                sx={(theme) => ({
                    p: 2.5,
                    bgcolor: theme.palette.background.drawer.primary,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                })}>
                <Stack direction="row" gap={2} mb={2}>
                    <UserAvatar useProfilePicture={true} />
                    <Typography
                        component="span"
                        variant="body1"
                        sx={(theme) => ({
                            fontWeight: 500,
                            alignSelf: 'center',
                            color: theme.palette.common.white,
                        })}>
                        Preferences
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={closeMenu}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing(2),
                            top: theme.spacing(2),
                            color: theme.palette.grey[500],
                        })}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <ThemeModeSelect themeModeAdaptive={false} />
                {process.env.IS_ANALYTICS_ENABLED === 'true' && (
                    <AvatarMenuItem
                        icon={<ShieldOutlined />}
                        onClick={() => {
                            window.Osano?.cm?.showDrawer();
                        }}
                        themeModeAdaptive={false}>
                        Privacy settings
                    </AvatarMenuItem>
                )}
                <Auth0LoginLink themeModeAdaptive={false} />
            </Box>
        </Popover>
    );
};
