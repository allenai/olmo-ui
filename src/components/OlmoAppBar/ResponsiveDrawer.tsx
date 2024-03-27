import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

const DRAWER_BREAK_POINT = 'sm';

interface ResponsiveDrawerProps extends PropsWithChildren {
    isDrawerOpen?: boolean;
    handleDrawerClose?: () => void;
}

export const ResponsiveDrawer = ({
    children,
    isDrawerOpen,
    handleDrawerClose,
}: ResponsiveDrawerProps) => {
    return (
        <>
            <Drawer
                variant="temporary"
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                sx={{ display: { xs: 'flex', [DRAWER_BREAK_POINT]: 'none', width: '100vw' } }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    paddingBlock={3}
                    paddingInline={2}>
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton aria-label="Close navigation drawer" onClick={handleDrawerClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                {children}
            </Drawer>
            <Drawer
                variant="permanent"
                // anchor="left"
                sx={{
                    width: 'auto',
                    display: { xs: 'none', [DRAWER_BREAK_POINT]: 'flex' },

                    gridArea: 'nav',
                    '.MuiDrawer-paper': {
                        // width: (theme) => theme.spacing(40),
                        boxSizing: 'border-box',
                        position: 'unset',
                    },
                }}>
                <Stack paddingInline={2} paddingBlock={4}>
                    <img src="/ai2-logo.png" alt="" height={33} width={292} />
                </Stack>
                {children}
            </Drawer>
        </>
    );
};
