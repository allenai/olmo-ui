import { Stack, Typography } from '@mui/material';

import { Outlet, useMatch } from 'react-router-dom';

import { useEffect } from 'react';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { QueryForm } from '@/components/thread/QueryForm';
import { SearchDatasetCard } from '@/components/thread/SearchDatasetCard';
import { ThreadCard } from '@/components/thread/ThreadCard';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';

export const UIRefreshThreadPage = () => {
    const sendAMessageToTheLLM = useAppContext((state) => state.sendAMessageToTheLLM);
    const resetSelectedThreadState = useAppContext((state) => state.resetSelectedThreadState);
    const isRootPlaygroundPage = useMatch(links.playground);

    const handlePromptSubmission = (data: { content: string; parent?: string }) => {
        sendAMessageToTheLLM(data);
    };

    useEffect(() => {
        if (isRootPlaygroundPage) {
            resetSelectedThreadState();
        }
    }, [isRootPlaygroundPage]);

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
