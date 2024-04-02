import { Button, ButtonGroup, Card, Stack, Theme, Typography, alpha } from '@mui/material';

import PlusIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import GearIcon from '@mui/icons-material/Settings';

import { useNavigate } from 'react-router';

import { Outlet } from 'react-router-dom';

import { ThreadPageCard } from '../components/thread/ThreadPageCard';

import { QueryForm } from '../components/thread/QueryForm';

import { links } from '../Links';
import { ResponsiveButton } from '@/components/thread/ResponsiveButton';

export const mdAndUpContainerQuery = (theme: Theme) =>
    `@container (min-width: ${theme.breakpoints.values.md}px)`;

export const belowMdContainerQuery = (theme: Theme) =>
    `@container (max-width: ${theme.breakpoints.values.md}px)`;

const ThreadButtons = (): JSX.Element => {
    return (
        <>
            <ResponsiveButton startIcon={<PlusIcon />} title="New Thread" variant="contained" />
            <ResponsiveButton startIcon={<GearIcon />} title="Parameters" variant="outlined" />
            <ResponsiveButton startIcon={<HistoryIcon />} title="History" variant="outlined" />
        </>
    );
};

export const UIRefreshThreadPage = () => {
    const navigate = useNavigate();

    const handlePromptSubmission = (data: { content: string }) => {
        console.log('data', data);
        navigate(links.thread('new'));
    };

    return (
        <Stack
            gap={4}
            sx={{
                containerName: 'thread-page',
                containerType: 'inline-size',
            }}>
            <Card
                variant="outlined"
                component={Stack}
                direction="row"
                gap={2}
                padding={2}
                sx={(theme) => ({
                    borderColor: alpha(theme.palette.primary.main, 0.5),

                    [belowMdContainerQuery(theme)]: {
                        border: 0,
                        backgroundColor: 'transparent',
                    },
                })}>
                <Typography
                    variant="h5"
                    component="h2"
                    margin={0}
                    marginInlineEnd="auto"
                    color={(theme) => theme.palette.primary.main}
                    sx={(theme) => ({
                        [belowMdContainerQuery(theme)]: {
                            display: 'none',
                        },
                    })}>
                    Thread
                </Typography>

                <Stack
                    direction="row"
                    gap={2}
                    sx={(theme) => ({
                        [belowMdContainerQuery(theme)]: {
                            display: 'none',
                        },
                    })}>
                    <ThreadButtons />
                </Stack>

                <ButtonGroup
                    variant="outlined"
                    sx={(theme) => ({
                        [mdAndUpContainerQuery(theme)]: {
                            display: 'none',
                        },
                    })}>
                    <ThreadButtons />
                </ButtonGroup>
            </Card>

            <ThreadPageCard>
                <Outlet />
                <QueryForm onSubmit={handlePromptSubmission} variant="new" />
            </ThreadPageCard>
        </Stack>
    );
};
