import { Box, Card, CardContent, Link, Typography } from '@mui/material';

import { links } from '@/Links';

import { useDesktopOrUp } from './dolma/shared';

export const DolmaCard = () => {
    const isDesktop = useDesktopOrUp();

    return (
        <>
            {isDesktop ? (
                <Card
                    sx={{
                        padding: '32px, 16px, 32px, 16px',
                        marginBottom: (theme) => theme.spacing(2),
                    }}>
                    <CardContent>
                        <Typography variant="h1" align="center">
                            Dolma is proven, trusted, and fully open.
                        </Typography>
                        <Typography variant="h5" align="center">
                            Dolma 1.7-7B is a dataset of 2.05 trillion tokens from a diverse mix of
                            web content, academic publications, code, books, and encyclopedic
                            materials. It is openly available for download on{' '}
                            <Link href={links.ourDatasets}>Hugging Face </Link>under the ODC-By
                            license.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Box
                    sx={{
                        padding: '32px, 16px, 32px, 16px',
                        marginBottom: (theme) => theme.spacing(2),
                    }}>
                    <Typography variant="h3" align="left">
                        Dolma is proven, trusted, and fully open.
                    </Typography>
                    <Typography variant="body1" align="left">
                        Dolma 1.7-7B is a dataset of 2.05 trillion tokens from a diverse mix of web
                        content, academic publications, code, books, and encyclopedic materials. It
                        is openly available for download on{' '}
                        <Link href={links.ourDatasets}>Hugging Face </Link>under the ODC-By license.
                    </Typography>
                </Box>
            )}
        </>
    );
};
