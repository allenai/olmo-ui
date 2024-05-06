import { Drawer, DrawerProps, GlobalStyles, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../constants';
import { useDesktopOrUp, useIsOnlyBreakpoint } from './dolma/shared';

export type ResponsiveDrawerProps = (Pick<
    DrawerProps,
    'open' | 'anchor' | 'children' | 'onClose'
> & {
    mobileHeading?: ReactNode;
    miniHeading?: ReactNode;
    heading?: ReactNode;

    desktopDrawerVariant?: DrawerProps['variant'];

    mobileDrawerSx?: SxProps<Theme>;
    desktopDrawerSx?: SxProps<Theme>;
}) &
    (
        | {
              enableMiniVariant?: false;
              miniVariantCollapsedWidth?: never;
              miniVariantExpandedWidth?: never;
          }
        | {
              enableMiniVariant: true;

              /**
               * This is a spacing token
               */
              miniVariantCollapsedWidth: number;

              /**
               * This is a spacing token
               */
              miniVariantExpandedWidth: number;
          }
    );

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
    miniHeading,
    heading,
    mobileDrawerSx,
    desktopDrawerSx,
    anchor = 'left',
    desktopDrawerVariant = 'permanent',
    ...rest
}: ResponsiveDrawerProps): JSX.Element => {
    const isPersistentDrawerClosed = !open && desktopDrawerVariant === 'persistent';
    const isDesktop = useDesktopOrUp();
    const isSmallestDesktopBreakpoint = useIsOnlyBreakpoint(DESKTOP_LAYOUT_BREAKPOINT);

    const desktopHeading =
        // Using `rest` for enableMiniVariant so we can infer the type of the mini variant widths easily
        isSmallestDesktopBreakpoint && rest.enableMiniVariant ? miniHeading : heading;

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
                            rest.enableMiniVariant && {
                                '& .MuiPaper-root': { position: 'static' },
                                whiteSpace: 'noWrap',

                                overflowX: 'hidden',
                                // This is slightly larger than the rough width of the drawer when it's expanded
                                // If the text gets longer and things start getting cut off you'll want to bump this up
                                maxWidth: (theme) =>
                                    `var(--navigation-drawer-max-width, ${theme.spacing(rest.miniVariantExpandedWidth)})`,

                                transition: (theme) =>
                                    theme.transitions.create('max-width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: `var(--navigation-drawer-max-width-transition-duration, ${theme.transitions.duration.enteringScreen}ms)`,
                                    }),

                                ...(!open &&
                                    isSmallestDesktopBreakpoint && {
                                        // This is a number I thought looked good to have just the icons showing.
                                        // If the icons get bigger or the padding around them changes, this will need to change
                                        '--navigation-drawer-max-width': (theme) =>
                                            theme.spacing(rest.miniVariantCollapsedWidth),
                                        '--navigation-drawer-max-width-transition-duration': (
                                            theme
                                        ) => `${theme.transitions.duration.leavingScreen}ms`,
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
