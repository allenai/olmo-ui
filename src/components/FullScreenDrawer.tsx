import { Box, Drawer } from '@mui/material';
import { KeyboardEvent, KeyboardEventHandler, PropsWithChildren, ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { DrawerId } from '@/slices/DrawerSlice';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

interface FullScreenDrawerProps extends PropsWithChildren {
    drawerId: DrawerId;
    header: ReactNode | (({ onDrawerClose }: { onDrawerClose: () => void }) => ReactNode);
    fullWidth?: boolean;
}

export const FullScreenDrawer = ({
    drawerId,
    header,
    children,
    fullWidth,
}: FullScreenDrawerProps) => {
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
                    backgroundImage: 'none', // Mui adds a linear-gradient of opacity white
                    width: fullWidth ? 'clamp(20rem, 100vw - 44px, 23rem)' : undefined,
                },
            }}>
            {typeof header === 'function' ? header({ onDrawerClose: handleDrawerClose }) : header}
            {/* minHeight here helps the children overflow properly */}
            <Box paddingBlockEnd={1} paddingInline={2} height={1}>
                {children}
            </Box>
        </Drawer>
    );
};

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
