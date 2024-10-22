import { CardContent, Link, Stack, Typography } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

import { DolmaInformationCard } from './DolmaInformationCard';
import { ResponsiveCard } from './ResponsiveCard';

export const DolmaCard = () => {
    return (
        <>
            <ResponsiveCard sx={{ backgroundColor: (theme) => theme.palette.background.reversed }}>
                <CardContent sx={{ padding: (theme) => theme.spacing(4, 2) }}>
                    <Typography
                        variant="h1"
                        align="center"
                        sx={(theme) => ({
                            color: theme.palette.common.white,
                            marginBottom: theme.spacing(2),
                        })}>
                        OLMoE-Mix is proven, trusted, and fully open.
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{ color: (theme) => theme.palette.common.white }}>
                        <Link
                            href={links.olmoeMixAnnouncement}
                            target="_blank"
                            sx={{ color: (theme) => theme.palette.secondary.light }}>
                            OLMoE-Mix
                        </Link>{' '}
                        is a dataset of 4.07 trillion tokens from a diverse mix of web content,
                        academic publications, code, math, and encyclopedic materials. It is openly
                        available for download under the ODC-By license.
                    </Typography>
                </CardContent>
            </ResponsiveCard>
            <Stack direction="row" flexWrap="wrap" gap={{ xs: 2, [DESKTOP_LAYOUT_BREAKPOINT]: 4 }}>
                <DolmaInformationCard
                    linkText="Learn more"
                    linkUrl="#"
                    title="How was OLMoE-Mix Created?"
                    buttonText="Read the blog"
                    buttonUrl={links.olmoeMixAnnouncement}
                />
                <DolmaInformationCard
                    linkText="Research"
                    linkUrl="#"
                    title="Access the Dataset on Hugging Face"
                    buttonText="Download OLMoE-Mix"
                    buttonUrl={links.olmoeMixDownload}
                />
            </Stack>
        </>
    );
};
