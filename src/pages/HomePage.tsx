import { Button, Stack, Typography } from '@mui/material';

import { AppLayout } from '@/components/AppLayout';
import { links } from '@/Links';

export const HomePage = () => {
    return (
        <AppLayout>
            <Stack direction="column" gap={2}>
                <Typography variant="h1">Showcasing truly open AI models</Typography>
                <Button href={links.playground} variant="contained">
                    Start testing our models now
                </Button>
            </Stack>
        </AppLayout>
    );
};
