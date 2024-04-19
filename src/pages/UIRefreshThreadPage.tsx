import { Stack, Typography } from '@mui/material';

import { useNavigate } from 'react-router';

import { Outlet, useMatch } from 'react-router-dom';

import { useEffect } from 'react';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { QueryForm } from '@/components/thread/QueryForm';
import { SearchDatasetCard } from '@/components/thread/SearchDatasetCard';
import { ThreadCard } from '@/components/thread/ThreadCard';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';

export const UIRefreshThreadPage = () => {
    const navigate = useNavigate();
    const sendAMessageToTheLLM = useAppContext((state) => state.sendAMessageToTheLLM);
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);

    // if we're on the selected thread page, handle submission differently
    const isNewThreadPage = useMatch(links.playground);

    const handlePromptSubmission = (data: { content: string; parent?: string }) => {
        sendAMessageToTheLLM(data);
    };

    useEffect(() => {
        if (selectedThreadId) {
            navigate(links.thread(selectedThreadId));
        }
    }, [selectedThreadId, navigate]);

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

            <SearchDatasetCard />

            <Typography variant="caption">
                OLMo is experimental and can make mistakes. Consider fact-checking your results.
            </Typography>
        </Stack>
    );
};
