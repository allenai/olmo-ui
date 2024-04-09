import { Breakpoint, Drawer, DrawerProps, GlobalStyles, SxProps, Theme } from '@mui/material';
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

const GlobalStyle = () => (
    <GlobalStyles
        styles={{
            body: {
                overflow: 'hidden', // prevent overflow when drawer slides into view
            },
        }}
    />
);

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
    const isPersistantDrawerClosed = !open && desktopDrawerVariant === 'persistent';

    return (
        <>
            <Drawer
                variant="temporary"
                anchor={anchor}
                open={open}
                onClose={onClose}
                disableScrollLock={false}
                PaperProps={{
                    sx: {
                        // This is intentionally not following the breakpoint. It looks nicer this way
                        width: { xs: '100vw', sm: 'auto' },
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
                    overflow: isPersistantDrawerClosed ? 'hidden' : 'visible',

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
                {heading}
                {children}
            </Drawer>
            {isPersistantDrawerClosed && <GlobalStyle />}
        </>
    );
};
