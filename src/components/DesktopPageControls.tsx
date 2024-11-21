import { Stack } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useRouteControls } from './OlmoAppBar/useRouteControls';

export const DesktopPageControls = (): ReactNode => {
    const controls = useRouteControls();

    const isAnyDrawerOpen = useAppContext((state) => state.currentOpenDrawer != null);

    return (
        <Stack
            direction="column"
            useFlexGap
            gap={1}
            paddingInline={3}
            paddingBlock={2.5}
            sx={{
                gridArea: 'controls',
                display: { xs: 'none', [DESKTOP_LAYOUT_BREAKPOINT]: 'flex' },
                // I don't feel like figuring out a good way to make sure stays the same width when there aren't buttons so I'm just hardcoding it to what the width is with buttons
                width: 88,
                backgroundColor: isAnyDrawerOpen ? 'background.drawer.secondary' : 'transparent',
            }}>
            {controls}
        </Stack>
    );
};
