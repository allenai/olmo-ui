import { Stack } from '@mui/material';
import { ReactNode } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useRouteControls } from './OlmoAppBar/useRouteControls';

export const DesktopPageControls = (): ReactNode => {
    const controls = useRouteControls();

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
            }}>
            {controls}
        </Stack>
    );
};
