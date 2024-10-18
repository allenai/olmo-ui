import { Box, Drawer } from '@mui/material';
import {
    forwardRef,
    KeyboardEvent,
    KeyboardEventHandler,
    PropsWithChildren,
    ReactNode,
    Ref,
} from 'react';

import { useAppContext } from '@/AppContext';
import { DrawerId } from '@/slices/DrawerSlice';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

interface TemporaryDrawerProps extends PropsWithChildren {
    drawerId: DrawerId;
    header: ReactNode | (({ onDrawerClose }: { onDrawerClose: () => void }) => ReactNode);
    fullWidth?: boolean;
}

export const FullScreenDrawer = forwardRef(function FullScreenDrawer(
    { drawerId, header, children, fullWidth }: TemporaryDrawerProps,
    ref: Ref<HTMLDivElement>
) {
    const closeDrawer = useAppContext((state) => state.closeDrawer);

    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === drawerId);

    const handleDrawerClose = () => {
        closeDrawer(drawerId);
    };

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

    const onKeyDownEscapeHandler: KeyboardEventHandler = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            handleDrawerClose();
        }
    };

    return (
        <Drawer
            variant="temporary"
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            onKeyDown={onKeyDownEscapeHandler}
            anchor="right"
            PaperProps={{
                sx: {
                    backgroundColor: (theme) => theme.palette.background.default,
                    width: fullWidth ? '100vw' : undefined,
                },
                ref,
            }}>
            {typeof header === 'function' ? header({ onDrawerClose: handleDrawerClose }) : header}
            <Box paddingBlockEnd={1} paddingInline={2}>
                {children}
            </Box>
        </Drawer>
    );
});

export const FullScreenDrawerHeader = ({ children }: PropsWithChildren) => {
    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'inherit',
                paddingBlockStart: 1,
                paddingInline: 2,
                zIndex: 1,
            }}>
            {children}
        </Box>
    );
};
