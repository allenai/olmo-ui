// Shared base component logic and layout for both desktop and mobile avatar menus.

import { Close, ShieldOutlined, StorageOutlined } from '@mui/icons-material';
import { Box, IconButton, ListItemText, Stack, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';

import { TermsAndConditionsModal } from '../TermsAndConditionsModal';
import { TermsAndConditionsProvider } from '../TermsAndConditionsModalContext';
import { Auth0LoginLink } from './Auth0LoginLink';
import { AvatarMenuItem } from './AvatarMenuItem';

type AvatarMenuBaseProps = {
    showEmail?: boolean;
    showHeader?: boolean;
    onClose?: () => void;
    themeModeAdaptive?: boolean;
    children: (content: ReactNode) => ReactNode;
};

export const AvatarMenuBase = ({
    children,
    showEmail = true,
    showHeader = false,
    onClose,
    themeModeAdaptive = true,
}: AvatarMenuBaseProps) => {
    const [showModal, setShowModal] = useState(false);
    const { userAuthInfo, userInfo } = useUserAuthInfo();
    const hasAcceptedTermsAndConditions = userInfo?.hasAcceptedTermsAndConditions === true;
    const hasAcceptedDataCollection = userInfo?.hasAcceptedDataCollection === true;

    const content = (
        <Box
            sx={(theme) => ({
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                bgcolor:
                    themeModeAdaptive && theme.palette.mode === 'light'
                        ? theme.palette.background.default
                        : theme.palette.background.drawer.primary,
            })}>
            {showHeader && (
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
                        onClick={onClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing(2),
                            top: theme.spacing(2),
                            color: theme.palette.grey[500],
                        })}>
                        <Close />
                    </IconButton>
                </Stack>
            )}
            {showEmail && !!userAuthInfo?.email && (
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
            <ThemeModeSelect themeModeAdaptive={themeModeAdaptive} />
            <AvatarMenuItem
                icon={<StorageOutlined />}
                onClick={() => {
                    setShowModal(true);
                }}
                themeModeAdaptive={themeModeAdaptive}>
                Data Collection
            </AvatarMenuItem>
            {process.env.VITE_IS_ANALYTICS_ENABLED === 'true' && (
                <AvatarMenuItem
                    icon={<ShieldOutlined />}
                    onClick={() => {
                        window.Osano?.cm?.showDrawer();
                    }}
                    themeModeAdaptive={themeModeAdaptive}>
                    Privacy settings
                </AvatarMenuItem>
            )}
            <Auth0LoginLink themeModeAdaptive={themeModeAdaptive} />
        </Box>
    );

    return (
        <>
            {children(content)}
            {showModal ? (
                <TermsAndConditionsProvider>
                    <TermsAndConditionsModal
                        onClose={async () => {
                            setShowModal(false);
                        }}
                        initialTermsAndConditionsValue={hasAcceptedTermsAndConditions}
                        initialDataCollectionValue={
                            hasAcceptedDataCollection ? 'opt-in' : 'opt-out'
                        }
                    />
                </TermsAndConditionsProvider>
            ) : null}
        </>
    );
};
