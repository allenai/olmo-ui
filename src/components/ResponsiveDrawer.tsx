import { Breakpoint, Drawer, DrawerProps, GlobalStyles, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../constants';
import { useDesktopOrUp, useMatchingMediaQuery } from './dolma/shared';

export interface ResponsiveDrawerProps
    extends Pick<DrawerProps, 'open' | 'anchor' | 'children' | 'onClose'> {
    mobileHeading?: ReactNode;
    tabletHeading?: ReactNode;
    heading?: ReactNode;

    drawerBreakpoint?: Breakpoint;

    desktopDrawerVariant?: DrawerProps['variant'];

    mobileDrawerSx?: SxProps<Theme>;
    desktopDrawerSx?: SxProps<Theme>;

    enableTabletMiniDrawer?: boolean;
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
    tabletHeading: tabletMiniDrawerHeading,
    heading,
    mobileDrawerSx,
    desktopDrawerSx,
    drawerBreakpoint = DESKTOP_LAYOUT_BREAKPOINT,
    anchor = 'left',
    desktopDrawerVariant = 'permanent',
    enableTabletMiniDrawer = false,
}: ResponsiveDrawerProps): JSX.Element => {
    const isPersistentDrawerClosed = !open && desktopDrawerVariant === 'persistent';
    const isDesktop = useDesktopOrUp();
    const width = useMatchingMediaQuery();

    const desktopHeading =
        width === DESKTOP_LAYOUT_BREAKPOINT && enableTabletMiniDrawer
            ? tabletMiniDrawerHeading
            : heading;

    return (
        <>
            {isDesktop ? (
                <Drawer
                    variant={desktopDrawerVariant}
                    open={open}
                    anchor={anchor}
                    onClose={onClose}
                    sx={{
                        width: 'auto',
                        overflow: isPersistentDrawerClosed ? 'hidden' : 'visible',

                        ...(desktopDrawerVariant === 'permanent' &&
                            enableTabletMiniDrawer && {
                                '& .MuiPaper-root': { position: 'static' },
                                whiteSpace: 'noWrap',

                                overflowX: 'hidden',
                                // This is slightly larger than the rough width of the drawer when it's expanded
                                // If the text gets longer and things start getting cut off you'll want to bump this up
                                maxWidth: (theme) =>
                                    `var(--navigation-drawer-max-width, ${theme.spacing(45)})`,

                                transition: (theme) =>
                                    theme.transitions.create('max-width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: `var(--navigation-drawer-max-width-transition-duration, ${theme.transitions.duration.enteringScreen}ms)`,
                                    }),

                                ...(!open && {
                                    // This is a number I thought looked good to have just the icons showing.
                                    // If the icons get bigger or the padding around them changes, this will need to change
                                    '--navigation-drawer-max-width': (theme) => theme.spacing(7),
                                    '--navigation-drawer-max-width-transition-duration': (theme) =>
                                        `${theme.transitions.duration.leavingScreen}ms`,
                                }),
                            }),

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
                    data-testid="Drawer">
                    {desktopHeading}
                    {children}
                </Drawer>
            ) : (
                <Drawer
                    variant="temporary"
                    anchor={anchor}
                    open={open}
                    onClose={onClose}
                    disableScrollLock={false}
                    PaperProps={{
                        sx: {
                            // This is intentionally not following the breakpoint. It looks nicer this way
                            width: { xs: '100vw', sm: '40vw' },
                        },
                    }}
                    sx={{
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
