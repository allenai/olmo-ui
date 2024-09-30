import { Drawer } from '@mui/material';
import { KeyboardEventHandler, PropsWithChildren, ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { DrawerId } from '@/slices/DrawerSlice';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

interface TemporaryDrawerProps extends PropsWithChildren {
    drawerId: DrawerId;
    header: ReactNode | (({ onDrawerClose }: { onDrawerClose: () => void }) => ReactNode);
    fullWidth?: boolean;
}

export const TemporaryDrawer = ({
    drawerId,
    header,
    children,
    fullWidth,
}: TemporaryDrawerProps) => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);

    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === drawerId);

    const handleDrawerClose = () => {
        closeDrawer(drawerId);
    };

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

    const onKeyDownEscapeHandler: KeyboardEventHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
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
                    paddingBlock: 1,
                    paddingInline: 2,
                    backgroundColor: (theme) => theme.palette.background.default,
                    width: fullWidth ? '100vw' : undefined,
                },
            }}>
            {typeof header === 'function' ? header({ onDrawerClose: handleDrawerClose }) : header}
            {children}
        </Drawer>
    );
};
