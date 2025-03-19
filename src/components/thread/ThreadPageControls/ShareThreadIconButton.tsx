import { IosShareOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material';
import { ReactNode } from 'react';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

export const ShareThreadIconButton = (): ReactNode => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const { isAuthenticated } = useUserAuthInfo();

    const shouldDisableShareButton = !selectedThreadId || !isAuthenticated;

    const handleShareThread = async () => {
        await navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));
        addSnackMessage({
            id: `thread-copy-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Link Copied',
        });
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            onClick={handleShareThread}
            disabled={shouldDisableShareButton}
            label="Share this thread"
            sx={(theme) => ({
                [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    '&.Mui-disabled': {
                        color: alpha(theme.palette.common.white, 0.26),
                    },
                },
            })}>
            <IosShareOutlined
                sx={{
                    // This Icon looks visually off when centered
                    transform: 'translateY(-2px)',
                }}
            />
        </IconButtonWithTooltip>
    );
};
