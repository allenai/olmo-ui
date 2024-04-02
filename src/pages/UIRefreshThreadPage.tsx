import { Stack, Typography } from '@mui/material';

import { useNavigate } from 'react-router';

import { Outlet } from 'react-router-dom';

import { ThreadCard } from '@/components/thread/ThreadCard';

import { QueryForm } from '@/components/thread/QueryForm';

import { links } from '@/Links';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';

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
            <ThreadPageControls />

            <ThreadCard>
                <Outlet />
                <QueryForm onSubmit={handlePromptSubmission} variant="new" />
            </ThreadCard>

            <Typography variant="caption">
                OLMo is experimental and can make mistakes. Consider fact-checking your results.
            </Typography>
        </Stack>
    );
};
