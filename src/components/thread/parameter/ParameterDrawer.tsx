import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, ListSubheader, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

import { useAppContext } from '@/AppContext';
import { useColorMode } from '@/components/ColorModeProvider';
import { DesktopExpandingDrawer } from '@/components/DesktopExpandingDrawer';
import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/FullScreenDrawer';
import { DrawerId } from '@/slices/DrawerSlice';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters';

export const DesktopParameterDrawer = ({ children }: PropsWithChildren): ReactElement => {
    const open = useAppContext((state) => state.currentOpenDrawer === PARAMETERS_DRAWER_ID);
    const { colorMode } = useColorMode();

    return (
        <DesktopExpandingDrawer open={open} id="desktop-parameter-drawer">
            <Box
                sx={{
                    paddingBlockStart: 5,
                    paddingBlockEnd: 2,
                }}>
                <Typography
                    variant="body2"
                    component="h2"
                    color={colorMode === 'dark' ? 'primary.main' : undefined}>
                    Parameters
                </Typography>
                {children}
            </Box>
        </DesktopExpandingDrawer>
    );
};

export const MobileParameterDrawer = ({ children }: PropsWithChildren): ReactElement => {
    return (
        <FullScreenDrawer
            drawerId="parameters"
            fullWidth
            header={({ onDrawerClose }) => (
                <FullScreenDrawerHeader>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography
                                variant="h5"
                                margin={0}
                                color={(theme) => theme.palette.text.primary}>
                                Parameters
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit', opacity: 0.5 }}
                            aria-label="close parameters drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </FullScreenDrawerHeader>
            )}>
            {children}
        </FullScreenDrawer>
    );
};
