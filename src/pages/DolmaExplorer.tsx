import { Stack } from '@mui/material';

import { DolmaTabs } from '@/components/dolma/DolmaTabs';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { DolmaCard } from '@/components/DolmaCard';

export const DolmaExplorer = () => {
    const isDesktop = useDesktopOrUp();

    return (
        <Stack
            sx={{
                textAlign: 'center',
            }}
            spacing={isDesktop ? 4 : 2}>
            <DolmaCard />
            <DolmaTabs />
        </Stack>
    );
};
