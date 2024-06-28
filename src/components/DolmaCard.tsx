import { CardContent, Link, Stack, Typography } from '@mui/material';

import { links } from '@/Links';

import { DolmaInformationCard } from './DolmaInformationCard';
import { ResponsiveCard } from './ResponsiveCard';

export const DolmaCard = () => {
    return (
        <>
            <ResponsiveCard>
                <CardContent sx={{ padding: (theme) => theme.spacing(4, 2) }}>
                    <Typography variant="h1" align="center">
                        Dolma is proven, trusted, and fully open.
                    </Typography>
                    <Typography variant="h5" align="center">
                        <Link href={links.dolma7B} target="_blank">
                            Dolma 1.7-7B
                        </Link>{' '}
                        is a dataset of 2.05 trillion tokens from a diverse mix of web content,
                        academic publications, code, books, and encyclopedic materials. It is openly
                        available for download on{' '}
                        <Link href={links.ourDatasets} target="_blank">
                            Hugging Face{' '}
                        </Link>{' '}
                        under the{' '}
                        <Link href={links.odc} target="_blank">
                            ODC-By
                        </Link>{' '}
                        license.
                    </Typography>
                </CardContent>
            </ResponsiveCard>
            <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 4, rowGap: 2 }}>
                <DolmaInformationCard
                    linkText="Learn More"
                    linkUrl="#"
                    title="How was Dolma Created?"
                    buttonText="Read the Blog"
                    buttonUrl={links.dolmaBlog}
                />
                <DolmaInformationCard
                    linkText="Research"
                    linkUrl="#"
                    title="Access the Dataset on Hugging Face"
                    buttonText="Get Started"
                    buttonUrl={links.ourDatasets}
                />
            </Stack>
        </>
    );
};
