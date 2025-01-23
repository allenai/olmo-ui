import { Box } from '@mui/material';
import { CSSProperties, PropsWithChildren, ReactNode, useEffect, useState } from 'react';

const DEFAULT_DRAWER_WIDTH = '20rem';

interface DesktopExpandingDrawerProps extends PropsWithChildren {
    id?: string;
    open?: boolean;
    width?: CSSProperties['width'];
    overflowY?: CSSProperties['overflowY'];
}
export const DesktopExpandingDrawer = ({
    id,
    open,
    width = DEFAULT_DRAWER_WIDTH,
    overflowY = 'auto',
    children,
}: DesktopExpandingDrawerProps): ReactNode => {
    // This allows us to show the drawer sliding closed instead of having it disappear immediately
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
            sx={(theme) => ({
                overflowX: 'hidden',
                width: open ? width : 0,
                transitionProperty: 'width, padding-inline',
                transitionDuration: '300ms',
                transitionTimingFunction: 'ease-in-out',
                height: '100%',
                minHeight: 0,
                overflowY,
                gridArea: 'drawer',
                visibility: isFullyClosed ? 'hidden' : 'visible',
                '--drop-shadow-color':
                    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.33)' : 'rgba(0, 0, 0, 0.15)',
                boxShadow: '0px 0px 120px var(--drop-shadow-color)',
            })}>
            <Box
                paddingInline={2}
                sx={{
                    minWidth: width,
                    height: '100%',
                }}>
                {children}
            </Box>
        </Box>
    );
};
