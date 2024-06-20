import { Stack } from '@mui/material';

import { DolmaCard } from '@/components/DolmaCard';

import { DolmaTabs } from '../components/dolma/DolmaTabs';

export const DolmaExplorer = () => (
    <>
        <Stack sx={{ textAlign: 'center' }} spacing={2}>
            <DolmaCard />
            <DolmaTabs />
        </Stack>
    </>
);
