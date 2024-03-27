import { Breakpoint, Drawer, DrawerProps } from '@mui/material';
import { ReactNode } from 'react';

import { NavDrawerProps } from './NavDrawer';

const DefaultDrawerBreakpoint = 'sm' as const;

export interface ResponsiveDrawerProps
    extends Pick<DrawerProps, 'open' | 'anchor' | 'children' | 'onClose'> {
    mobileHeading?: ReactNode;
    desktopHeading?: ReactNode;

    drawerBreakpoint?: Breakpoint;
}

export const ResponsiveDrawer = ({
    children,
    open,
    onClose,
    mobileHeading,
    desktopHeading,
    drawerBreakpoint = DefaultDrawerBreakpoint,
    anchor = 'left',
}: NavDrawerProps) => {
    return (
        <>
            <Drawer
                variant="temporary"
                anchor={anchor}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: '100vw',
                    },
                }}
                sx={{ display: { xs: 'flex', [drawerBreakpoint]: 'none' } }}>
                {mobileHeading}
                {children}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    width: 'auto',
                    display: { xs: 'none', [drawerBreakpoint]: 'flex' },

                    gridArea: 'nav',
                }}
                PaperProps={{
                    sx: {
                        maxWidth: (theme) => theme.spacing(50),
                        position: 'unset',
                    },
                }}>
                {desktopHeading}
                {children}
            </Drawer>
        </>
    );
};
