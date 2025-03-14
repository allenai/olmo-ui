import { PopperOwnProps } from '@mui/base';
import { ShieldOutlined } from '@mui/icons-material';
import { Box, Popper, SxProps, Theme } from '@mui/material';

import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';

import { Auth0LoginLink } from './Auth0LoginLink';
import { AvatarMenuItem } from './AvatarMenuItem';

type AvatarMenuProps = Pick<PopperOwnProps, 'anchorEl' | 'placement'> & {
    sx?: SxProps<Theme>;
};

export const AvatarMenu = ({ anchorEl, placement, sx }: AvatarMenuProps) => {
    return (
        <>
            <Popper
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                placement={placement}
                sx={sx}
                data-testid="avatar-menu">
                <Box
                    sx={(theme) => ({
                        p: 2.5,
                        borderRadius: '16px',
                        bgcolor:
                            theme.palette.mode === 'light'
                                ? theme.palette.background.default
                                : theme.palette.background.drawer.primary,
                        boxShadow: `0px 4px 60px 0px alpha(${(theme.palette.common.black, 0.15)})`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    })}>
                    <ThemeModeSelect />
                    {process.env.IS_ANALYTICS_ENABLED === 'true' && (
                        <AvatarMenuItem
                            icon={<ShieldOutlined />}
                            onClick={() => {
                                window.Osano?.cm?.showDrawer();
                            }}>
                            Privacy settings
                        </AvatarMenuItem>
                    )}
                    <Auth0LoginLink />
                </Box>
            </Popper>
        </>
    );
};
