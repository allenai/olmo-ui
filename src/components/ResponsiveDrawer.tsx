import { Breakpoint, Drawer, DrawerProps } from '@mui/material';
import { ReactNode } from 'react';

import { DesktopLayoutBreakpoint } from '../constants';

export interface ResponsiveDrawerProps
    extends Pick<DrawerProps, 'open' | 'anchor' | 'children' | 'onClose'> {
    mobileHeading?: ReactNode;
    desktopHeading?: ReactNode;

    drawerBreakpoint?: Breakpoint;

    desktopDrawerVariant?: DrawerProps['variant'];
}

export const ResponsiveDrawer = ({
    children,
    open,
    onClose,
    mobileHeading,
    desktopHeading,
    drawerBreakpoint = DesktopLayoutBreakpoint,
    anchor = 'left',
    desktopDrawerVariant = 'permanent',
}: ResponsiveDrawerProps): JSX.Element => {
    return (
        <>
            <Drawer
                variant="temporary"
                anchor={anchor}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: { xs: '100vw', sm: 'auto' },
                    },
                }}
                sx={{ display: { xs: 'flex', [drawerBreakpoint]: 'none' } }}>
                {mobileHeading}
                {children}
            </Drawer>
            <Drawer
                variant={desktopDrawerVariant}
                open={open}
                onClose={onClose}
                sx={{
                    width: 'auto',
                    display: { xs: 'none', [drawerBreakpoint]: 'flex' },

                    gridArea: 'nav',
                }}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        maxWidth: (theme) => theme.spacing(50),
                        position: 'unset',
                        backgroundColor: (theme) => theme.palette.background.default,
                        borderRight: 'none',
                    },
                }}>
                {desktopHeading}
                {children}
            </Drawer>
        </>
    );
};
