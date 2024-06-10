import { Box, Card, CardContent, Link, Typography } from '@mui/material';

import { links } from '@/Links';

import { useDesktopOrUp } from './dolma/shared';

const DOLMA_TITLE = 'Dolma is proven, trusted, and fully open.';

const DOLMA_CONTENT =
    'Dolma 1.7-7B is a dataset of 2.05 trillion tokens from a diverse mix of web content, academic publications, code, books, and encyclopedic materials. It is openly available for download on';

export const DolmaCard = () => {
    const isDesktop = useDesktopOrUp();

    return (
        <>
            {isDesktop ? (
                <Card
                    sx={{
                        padding: (theme) => theme.spacing(4, 2, 4, 2),
                        marginBottom: (theme) => theme.spacing(2),
                    }}>
                    <CardContent>
                        <Typography variant="h1" align="center">
                            {DOLMA_TITLE}
                        </Typography>
                        <Typography variant="h5" align="center">
                            {DOLMA_CONTENT} <Link href={links.ourDatasets}>Hugging Face </Link>under
                            license.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Box
                    sx={{
                        padding: (theme) => theme.spacing(4, 2, 4, 2),
                        marginBottom: (theme) => theme.spacing(2),
                    }}>
                    <Typography variant="h3" align="left">
                        {DOLMA_TITLE}
                    </Typography>
                    <Typography variant="body1" align="left">
                        {DOLMA_CONTENT} <Link href={links.ourDatasets}>Hugging Face </Link>under
                        license.
                    </Typography>
                </Box>
            )}
        </>
    );
};
