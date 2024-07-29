import {
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction, useMatch } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { QueryForm } from '@/components/thread/QueryForm';
import { SearchDatasetCard } from '@/components/thread/SearchDatasetCard';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';
import { links } from '@/Links';

export const UIRefreshThreadPage = () => {
    const streamPrompt = useAppContext((state) => state.streamPrompt);
    const models = useAppContext((state) => state.models);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);
    const selectedModel = useAppContext((state) => state.selectedModel);
    const threadPageMatch = useMatch(links.thread(':id'));

    const handlePromptSubmission = (data: { content: string; parent?: string }) => {
        streamPrompt(data);
    };

    const onModelChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value);
    };

    return (
        <Stack
            gap={4}
            sx={{
                containerName: 'thread-page',
                containerType: 'inline-size',
            }}>
            <ThreadPageControls />

            <Select
                id="model-select"
                sx={{ width: { xs: '75%', md: '35%' } }}
                size="small"
                onChange={onModelChange}
                input={<OutlinedInput />}
                value={(selectedModel && selectedModel.id) || ''}>
                {models.map((model) => (
                    <MenuItem key={model.name} value={model.id}>
                        {model.name}
                    </MenuItem>
                ))}
            </Select>

            <ResponsiveCard>
                <Outlet />
                <QueryForm onSubmit={handlePromptSubmission} variant="new" />
            </ResponsiveCard>

            {threadPageMatch && <SearchDatasetCard />}

            <Typography variant="caption">
                OLMo is experimental and can make mistakes. Consider fact-checking your results.
            </Typography>
        </Stack>
    );
};

export const playgroundLoader: LoaderFunction = async ({ params }) => {
    const { models, getAllModels, resetSelectedThreadState } = appContext.getState();

    if (models.length === 0) {
        await getAllModels();
    }

    if (params.id === undefined) {
        resetSelectedThreadState();
    }

    return null;
};

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
