import { PopperOwnProps } from '@mui/base';
import { ShieldOutlined } from '@mui/icons-material';
import { Box, ListItemText, Popper, SxProps, Theme } from '@mui/material';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';

import { Auth0LoginLink } from './Auth0LoginLink';
import { AvatarMenuItem } from './AvatarMenuItem';

type AvatarMenuProps = Pick<PopperOwnProps, 'anchorEl' | 'placement'> & {
    sx?: SxProps<Theme>;
};

export const AvatarMenu = ({ anchorEl, placement, sx }: AvatarMenuProps) => {
    const { userAuthInfo } = useUserAuthInfo();

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
                        borderRadius: 4,
                        bgcolor:
                            theme.palette.mode === 'light'
                                ? theme.palette.background.default
                                : theme.palette.background.drawer.primary,
                        boxShadow: `0px 4px 60px 0px rgba(0, 0, 0, 0.15)`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    })}>
                    {!!userAuthInfo?.email && (
                        <ListItemText
                            sx={{
                                margin: 0,
                                marginInlineEnd: 'auto',
                                opacity: 0.5,
                                marginBottom: 1.5,
                            }}
                            primaryTypographyProps={{
                                variant: 'body1',
                                fontWeight: 500,
                                component: 'span',
                            }}>
                            {userAuthInfo.email}
                        </ListItemText>
                    )}
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
