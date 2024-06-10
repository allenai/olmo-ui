import { Link, Typography } from '@mui/material';

import { links } from '@/Links';

import { ResponsiveCard } from './ResponsiveCard';

const DOLMA_TITLE = 'Dolma is proven, trusted, and fully open.';

const DOLMA_CONTENT =
    'Dolma 1.7-7B is a dataset of 2.05 trillion tokens from a diverse mix of web content, academic publications, code, books, and encyclopedic materials. It is openly available for download on';

export const DolmaCard = () => {
    return (
        <ResponsiveCard>
            <Typography variant="h1" align="center">
                {DOLMA_TITLE}
            </Typography>
            <Typography variant="h5" align="center">
                {DOLMA_CONTENT} <Link href={links.ourDatasets}>Hugging Face </Link>under license.
            </Typography>
        </ResponsiveCard>
    );
};
