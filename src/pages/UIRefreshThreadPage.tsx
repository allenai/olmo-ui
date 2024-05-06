import { Stack, Typography } from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { QueryForm } from '@/components/thread/QueryForm';
import { SearchDatasetCard } from '@/components/thread/SearchDatasetCard';
import { ThreadCard } from '@/components/thread/ThreadCard';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';
import { links } from '@/Links';

export const UIRefreshThreadPage = () => {
    const streamPrompt = useAppContext((state) => state.streamPrompt);

    const handlePromptSubmission = (data: { content: string; parent?: string }) => {
        streamPrompt(data);
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

            <SearchDatasetCard />

            <Typography variant="caption">
                OLMo is experimental and can make mistakes. Consider fact-checking your results.
            </Typography>
        </Stack>
    );
};

export const resetSelectedThreadLoader: LoaderFunction = async ({ params }) => {
    const { resetSelectedThreadState } = appContext.getState();
    if (params.id === undefined) {
        resetSelectedThreadState();
    }
    return null;
};

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
