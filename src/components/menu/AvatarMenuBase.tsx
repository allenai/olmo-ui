// Shared base component logic and layout for both desktop and mobile avatar menus.

import { Close, ShieldOutlined, StorageOutlined } from '@mui/icons-material';
import type { PaletteMode } from '@mui/material';
import { Box, IconButton, ListItemText, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { ThemeModeSelect } from '@/components/OlmoAppBar/ThemeModeSelect';

import { TermsAndDataCollectionModal } from '../TermsAndDataCollectionModal';
import { Auth0LoginLink } from './Auth0LoginLink';
import { AvatarMenuItem } from './AvatarMenuItem';

type AvatarMenuBaseProps = {
    showEmail?: boolean;
    showHeader?: boolean;
    onClose?: () => void;
    colorScheme?: PaletteMode;
    children: (content: ReactNode) => ReactNode;
};

export const AvatarMenuBase = ({
    children,
    showEmail = true,
    showHeader = false,
    onClose,
    colorScheme,
}: AvatarMenuBaseProps) => {
    const [showModal, setShowModal] = useState(false);
    const { userAuthInfo, userInfo } = useUserAuthInfo();
    const hasAcceptedTermsAndConditions = userInfo?.hasAcceptedTermsAndConditions === true;
    const hasAcceptedDataCollection = userInfo?.hasAcceptedDataCollection === true;
    const hasAcceptedMediaCollection = userInfo?.hasAcceptedMediaCollection === true;

    const content = (
        <Box
            sx={(theme) => {
                return {
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    backgroundColor: theme.vars.palette.background.drawer.secondary,
                };
            }}>
            {showHeader && (
                <Stack direction="row" gap={2} mb={2}>
                    <UserAvatar useProfilePicture={true} />
                    <Typography
                        component="span"
                        variant="body1"
                        sx={{
                            fontWeight: 500,
                            alignSelf: 'center',
                        }}>
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
                    slotProps={{
                        primary: {
                            variant: 'body1',
                            fontWeight: 500,
                            component: 'span',
                        },
                    }}>
                    {userAuthInfo.email}
                </ListItemText>
            )}
            <ThemeModeSelect colorScheme={colorScheme} />
            <AvatarMenuItem
                icon={<StorageOutlined />}
                onClick={() => {
                    setShowModal(true);
                }}>
                Data Collection
            </AvatarMenuItem>
            {process.env.VITE_IS_ANALYTICS_ENABLED === 'true' && (
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
    );

    return (
        <>
            {children(content)}
            {showModal ? (
                <TermsAndDataCollectionModal
                    onClose={async () => {
                        setShowModal(false);
                    }}
                    initialTermsAndConditionsValue={hasAcceptedTermsAndConditions}
                    initialDataCollectionValue={hasAcceptedDataCollection}
                    initialMediaCollectionValue={hasAcceptedMediaCollection}
                />
            ) : null}
        </>
    );
};
