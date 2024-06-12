import { CardContent, Grid, Link, Stack, Typography } from '@mui/material';

import { links } from '@/Links';

import { useDesktopOrUp } from './dolma/shared';
import { DolmaInformationCard } from './DolmaInformationCard';
import { ResponsiveCard } from './ResponsiveCard';

export const DolmaCard = () => {
    const isDesktopOrUp = useDesktopOrUp();

    return (
        <>
            <ResponsiveCard>
                <CardContent sx={{ padding: (theme) => theme.spacing(4, 2) }}>
                    <Typography variant="h1" align="center">
                        Dolma is proven, trusted, and fully open.
                    </Typography>
                    <Typography variant="h5" align="center">
                        Dolma 1.7-7B is a dataset of 2.05 trillion tokens from a diverse mix of web
                        content, academic publications, code, books, and encyclopedic materials. It
                        is openly available for download on{' '}
                        <Link href={links.ourDatasets}>Hugging Face </Link>under license.
                    </Typography>
                </CardContent>
            </ResponsiveCard>
            {isDesktopOrUp ? (
                <Grid container spacing={2} sx={{ display: 'flex' }}>
                    <Grid item xs={6} sx={{ display: 'flex' }}>
                        <DolmaInformationCard
                            linkText="Learn More"
                            linkUrl="#"
                            title="How was Dolma Created?"
                            buttonText="Read the Blog"
                            buttonUrl="#"
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex' }}>
                        <DolmaInformationCard
                            linkText="Research"
                            linkUrl="#"
                            title="Access the Dataset on Hugging Face"
                            buttonText="Get Started"
                            buttonUrl="#"
                        />
                    </Grid>
                </Grid>
            ) : (
                <Stack spacing={2}>
                    <DolmaInformationCard
                        linkText="Learn More"
                        linkUrl="#"
                        title="How was Dolma Created?"
                        buttonText="Read the Blog"
                        buttonUrl="#"
                    />
                    <DolmaInformationCard
                        linkText="Research"
                        linkUrl="#"
                        title="Access the Dataset on Hugging Face"
                        buttonText="Get Started"
                        buttonUrl="#"
                    />
                </Stack>
            )}
        </>
    );
};
