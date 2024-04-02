import { Breakpoint, Drawer, DrawerProps, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../constants';

export interface ResponsiveDrawerProps
    extends Pick<DrawerProps, 'open' | 'anchor' | 'children' | 'onClose'> {
    mobileHeading?: ReactNode;
    heading?: ReactNode;

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
    heading,
    mobileDrawerSx,
    desktopDrawerSx,
    drawerBreakpoint = DESKTOP_LAYOUT_BREAKPOINT,
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
                        // This is intentionally not following the breakpoint. It looks nicer this way
                        width: { xs: '100vw', sm: 'auto' },
                        overflow: 'visible',
                    },
                }}
                sx={{
                    display: { xs: 'flex', [drawerBreakpoint]: 'none' },
                    ...mobileDrawerSx,
                }}>
                {mobileHeading ?? heading}
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
                        overflow: 'visible',
                    },
                }}>
                {heading}
                {children}
            </Drawer>
        </>
    );
};
