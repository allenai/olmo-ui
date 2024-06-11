import { CardContent, Link, Typography } from '@mui/material';

import { links } from '@/Links';

import { ResponsiveCard } from './ResponsiveCard';

export const DolmaCard = () => {
    return (
        <ResponsiveCard>
            <CardContent sx={{ padding: (theme) => theme.spacing(4, 2) }}>
                <Typography variant="h1" align="center">
                    Dolma is proven, trusted, and fully open.
                </Typography>
                <Typography variant="h5" align="center">
                    Dolma 1.7-7B is a dataset of 2.05 trillion tokens from a diverse mix of web
                    content, academic publications, code, books, and encyclopedic materials. It is
                    openly available for download on{' '}
                    <Link href={links.ourDatasets}>Hugging Face </Link>under license.
                </Typography>
            </CardContent>
        </ResponsiveCard>
    );
};
