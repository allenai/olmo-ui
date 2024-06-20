import { Stack } from '@mui/material';

import { DomainsTable } from '@/components/dolma/DomainsTable';
import { DolmaCard } from '@/components/DolmaCard';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';

export const DolmaExplorer = () => (
    <>
        <Stack sx={{ textAlign: 'center' }} spacing={2}>
            <DolmaCard />
            <SearchForm />
            <DomainsTable />
            <NewSearchPlaceholder />
        </Stack>
    </>
);
