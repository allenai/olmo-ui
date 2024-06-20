import { Stack } from '@mui/material';

import { DomainsTable } from '@/components/dolma/DomainsTable';
import { DolmaCard } from '@/components/DolmaCard';

import { DolmaTabs } from '../components/dolma/DolmaTabs';

export const DolmaExplorer = () => (
    <>
        <Stack sx={{ textAlign: 'center' }} spacing={2}>
            <DolmaCard />
            <DomainsTable />
            <DolmaTabs />
        </Stack>
    </>
);
