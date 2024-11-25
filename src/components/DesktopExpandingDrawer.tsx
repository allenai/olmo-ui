import { Box } from '@mui/material';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

const DRAWER_WIDTH = '20rem';

interface DesktopExpandingDrawerProps extends PropsWithChildren {
    id?: string;
    open?: boolean;
}
export const DesktopExpandingDrawer = ({
    id,
    open,
    children,
}: DesktopExpandingDrawerProps): ReactNode => {
    const [isFullyClosed, setIsFullyClosed] = useState(true);

    // TODO: We should focus the opened drawer when we open it
    useEffect(() => {
        if (open) {
            setIsFullyClosed(false);
        }
    }, [open]);

    return (
        <Box
            id={id}
            onTransitionEnd={() => {
                if (!open) {
                    setIsFullyClosed(true);
                }
            }}
            sx={{
                overflowX: 'hidden',
                width: open ? DRAWER_WIDTH : 0,
                transitionProperty: 'width, padding-inline',
                transitionDuration: '300ms',
                transitionTimingFunction: 'ease-in-out',
                height: '100%',
                minHeight: 0,
                overflowY: 'auto',
                gridArea: 'drawer',
                visibility: isFullyClosed ? 'hidden' : 'visible',
            }}>
            <Box
                paddingInline={2}
                sx={{
                    minWidth: DRAWER_WIDTH,
                }}>
                {children}
            </Box>
        </Box>
    );
};
