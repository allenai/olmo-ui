import { Breakpoint, Drawer, DrawerProps, GlobalStyles, SxProps, Theme } from '@mui/material';
import { KeyboardEventHandler, ReactNode } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../constants';
import { useDesktopOrUp } from './dolma/shared';

export interface ResponsiveDrawerProps
    extends Pick<DrawerProps, 'open' | 'anchor' | 'children' | 'onClose' | 'onKeyDown'> {
    mobileHeading?: ReactNode;
    heading?: ReactNode;

    drawerBreakpoint?: Breakpoint;

    desktopDrawerVariant?: DrawerProps['variant'];

    mobileDrawerSx?: SxProps<Theme>;
    desktopDrawerSx?: SxProps<Theme>;
    drawerRef?: React.RefObject<HTMLDivElement>;
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
    drawerRef,
    onKeyDown,
}: ResponsiveDrawerProps): JSX.Element => {
    const isPersistentDrawerClosed = !open && desktopDrawerVariant === 'persistent';

    return (
        <>
            {useDesktopOrUp() ? (
                <Drawer
                    variant={desktopDrawerVariant}
                    open={open}
                    anchor={anchor}
                    onClose={onClose}
                    onKeyDown={onKeyDown}
                    sx={{
                        width: 'auto',
                        display: { xs: 'none', [drawerBreakpoint]: 'flex' },
                        overflow: isPersistentDrawerClosed ? 'hidden' : 'visible',
                        outline: 'none',

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
                    }}
                    data-testid="Drawer"
                    ref={drawerRef}
                    tabIndex={0}>
                    {heading}
                    {children}
                </Drawer>
            ) : (
                <Drawer
                    variant="temporary"
                    anchor={anchor}
                    open={open}
                    onClose={onClose}
                    disableScrollLock={false}
                    onKeyDown={onKeyDown}
                    PaperProps={{
                        sx: {
                            // This is intentionally not following the breakpoint. It looks nicer this way
                            width: { xs: '100vw', sm: '40vw' },
                        },
                    }}
                    sx={{
                        display: { xs: 'flex', [drawerBreakpoint]: 'none' },
                        ...mobileDrawerSx,
                    }}
                    data-testid="Drawer">
                    {mobileHeading ?? heading}
                    {children}
                </Drawer>
            )}

            {isPersistentDrawerClosed && <GlobalStyle />}
        </>
    );
};
