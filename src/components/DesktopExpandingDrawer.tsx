import { Box } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

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
    return (
        <Box
            id={id}
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
