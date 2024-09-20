import { Stack } from '@mui/material';

import { DolmaCard } from '@/components/DolmaCard';

import { DolmaTabs } from '../components/dolma/DolmaTabs';

export const DolmaExplorer = () => (
    <>
        <Stack
            sx={{
                textAlign: 'center',
                gridArea:
                    // this maps to grid-row-start / grid-column-start / grid-row-end / grid-column-end
                    'content / content / aside / aside',
                overflow: 'auto',
            }}
            spacing={2}>
            <DolmaCard />
            <DolmaTabs />
        </Stack>
    </>
);
