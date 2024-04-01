import { Button, Card, CardContent, Stack, Typography, alpha } from '@mui/material';

import PlusIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import GearIcon from '@mui/icons-material/Settings';

import { useNavigate } from 'react-router';

import { QueryForm } from '../components/thread/QueryForm';

import { links } from '../Links';

export const NewThreadPage = () => {
    const navigate = useNavigate();

    const handlePromptSubmission = (data: { content: string }) => {
        console.log('data', data);
        navigate(links.thread('new'));
    };
    return (
        <Stack gap={4} sx={{ containerName: 'thread-page', containerType: 'inline-size' }}>
            <Card
                variant="outlined"
                component={Stack}
                direction="row"
                gap={2}
                padding={2}
                sx={(theme) => ({
                    borderColor: alpha(theme.palette.primary.main, 0.5),

                    // display: 'none',
                    [`@container (min-width: ${theme.breakpoints.values.md}px)`]: {
                        display: 'inline-flex',
                    },
                })}>
                <Typography
                    variant="h5"
                    component="h2"
                    margin={0}
                    marginInlineEnd="auto"
                    color={(theme) => theme.palette.primary.main}>
                    Thread
                </Typography>
                <Button variant="outlined" startIcon={<PlusIcon />}>
                    New Thread
                </Button>
                <Button variant="outlined" startIcon={<GearIcon />}>
                    Parameters
                </Button>
                <Button variant="outlined" startIcon={<HistoryIcon />}>
                    History
                </Button>
            </Card>

            {/* <ButtonGroup variant="outlined">
                <ResponsiveButton startIcon={<PlusIcon />}>New Thread</ResponsiveButton>
                <ResponsiveButton startIcon={<GearIcon />}>Parameters</ResponsiveButton>
                <ResponsiveButton startIcon={<HistoryIcon />}>History</ResponsiveButton>
            </ButtonGroup> */}

            <Card raised elevation={1}>
                <CardContent>
                    <QueryForm onSubmit={handlePromptSubmission} />
                </CardContent>
            </Card>
        </Stack>
    );
};
