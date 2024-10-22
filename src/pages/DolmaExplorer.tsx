import { Stack } from '@mui/material';

import { DolmaTabs } from '@/components/dolma/DolmaTabs';
import { DolmaCard } from '@/components/DolmaCard';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

export const DolmaExplorer = () => {
    return (
        <Stack textAlign="center" spacing={{ xs: 2, [DESKTOP_LAYOUT_BREAKPOINT]: 4 }}>
            <DolmaCard />
            <DolmaTabs />
        </Stack>
    );
};
