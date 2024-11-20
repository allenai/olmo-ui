import { Stack } from '@mui/material';
import { ReactNode } from 'react';

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
            sx={{ gridArea: 'controls' }}>
            {controls}
        </Stack>
    );
};
