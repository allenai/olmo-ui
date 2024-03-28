import { Breakpoint, Drawer, DrawerProps, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

import { DesktopLayoutBreakpoint } from '../constants';

export interface ResponsiveDrawerProps
    extends Pick<DrawerProps, 'open' | 'anchor' | 'children' | 'onClose'> {
    mobileHeading?: ReactNode;
    desktopHeading?: ReactNode;
    isPersistent?: boolean;
    drawerBreakpoint?: Breakpoint;
    desktopDrawerVariant?: DrawerProps['variant'];

    mobileDrawerSx?: SxProps<Theme>;
    desktopDrawerSx?: SxProps<Theme>;
}

export const ResponsiveDrawer = ({
    children,
    open,
    onClose,
    mobileHeading,
    desktopHeading,
    mobileDrawerSx,
    desktopDrawerSx,
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
                sx={{ display: { xs: 'flex', [drawerBreakpoint]: 'none' }, ...mobileDrawerSx }}>
                {mobileHeading}
                {children}
            </Drawer>
            <Drawer
                variant={desktopDrawerVariant}
                open={open}
                anchor={anchor}
                onClose={onClose}
                sx={{
                    width: 'auto',
                    display: { xs: 'none', [drawerBreakpoint]: 'flex' },

                    ...desktopDrawerSx,
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
