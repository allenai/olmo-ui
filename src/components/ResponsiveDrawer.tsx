import { Drawer, DrawerProps, GlobalStyles, SxProps, Theme } from '@mui/material';
import type { KeyboardEvent, ReactNode } from 'react';

import { useDesktopOrUp } from './dolma/shared';

type BaseResponsiveDrawerProps = {
    mobileHeading?: ReactNode;
    heading?: ReactNode;

    desktopDrawerVariant?: DrawerProps['variant'];

    mobileDrawerSx?: SxProps<Theme>;
    desktopDrawerSx?: SxProps<Theme>;

    onKeyDownHandler?: (event: KeyboardEvent<HTMLDivElement>) => void;
};

type ResponsiveDrawerProps = Pick<
    DrawerProps,
    'open' | 'anchor' | 'children' | 'onClose' | 'onKeyDown'
> &
    BaseResponsiveDrawerProps;

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
    onKeyDownHandler,
    mobileHeading,
    heading,
    mobileDrawerSx,
    desktopDrawerSx,
    anchor = 'left',
    desktopDrawerVariant = 'permanent',
}: ResponsiveDrawerProps): ReactNode => {
    const isPersistentDrawerClosed = !open && desktopDrawerVariant === 'persistent';
    const isDesktop = useDesktopOrUp();

    return (
        <>
            {isDesktop ? (
                <Drawer
                    variant={desktopDrawerVariant}
                    open={open}
                    anchor={anchor}
                    onClose={onClose}
                    onKeyDown={onKeyDownHandler}
                    sx={[
                        {
                            width: 'auto',
                            overflow: isPersistentDrawerClosed ? 'hidden' : 'visible',
                        },
                        // Array.isArray doesn't preserve Sx's array type
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        ...(Array.isArray(desktopDrawerSx) ? desktopDrawerSx : [desktopDrawerSx]),
                    ]}
                    slotProps={{
                        paper: {
                            elevation: 2,
                            sx: (theme) => ({
                                background: theme.vars.palette.background.drawer.primary,
                                maxWidth: theme.spacing(50),
                                position: 'unset',
                                borderRight: 'none',
                            }),
                        },
                    }}
                    data-testid="Drawer">
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
                    onKeyDown={onKeyDownHandler}
                    slotProps={{
                        paper: {
                            sx: (theme) => ({
                                background: theme.vars.palette.background.drawer.primary,
                                width: 'clamp(20rem, 100vw - 44px, 23rem)',
                            }),
                        },
                    }}
                    sx={mobileDrawerSx}
                    data-testid="Drawer">
                    {mobileHeading ?? heading}
                    {children}
                </Drawer>
            )}

            {isPersistentDrawerClosed && <GlobalStyle />}
        </>
    );
};
