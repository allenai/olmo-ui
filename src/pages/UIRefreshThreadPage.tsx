import {
    Card,
    CardContent,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { QueryForm } from '@/components/thread/QueryForm';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';
import { links } from '@/Links';

export const UIRefreshThreadPage = () => {
    const streamPrompt = useAppContext((state) => state.streamPrompt);
    const models = useAppContext((state) => state.models);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);
    const selectedModel = useAppContext((state) => state.selectedModel);

    const handlePromptSubmission = (data: { content: string; parent?: string }) => {
        streamPrompt(data);
    };

    const onModelChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value);
    };

    return (
        <Card
            variant="elevation"
            elevation={0}
            sx={{
                flexGrow: '1',
            }}>
            <CardContent
                component={Stack}
                gap={2}
                sx={{
                    containerName: 'thread-page',
                    containerType: 'inline-size',

                    backgroundColor: 'background.default',

                    paddingBlock: 2,
                    paddingInline: 4,

                    height: 1,
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

                <Outlet />
                <QueryForm onSubmit={handlePromptSubmission} variant="new" />

                <Typography variant="caption">
                    OLMo is experimental and can make mistakes. Consider fact-checking your results.
                </Typography>
            </CardContent>
        </Card>
    );
};

export const playgroundLoader: LoaderFunction = async ({ params }) => {
    const { models, getAllModels, resetSelectedThreadState, resetAttribution } =
        appContext.getState();

    if (models.length === 0) {
        await getAllModels();
    }

    if (params.id === undefined) {
        resetSelectedThreadState();
        resetAttribution();
    }

    return null;
};

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
