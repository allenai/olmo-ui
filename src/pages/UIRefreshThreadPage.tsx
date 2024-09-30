import {
    Card,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { MetaTags } from '@/components/MetaTags';
import { AttributionDrawer } from '@/components/thread/attribution/drawer/AttributionDrawer';
import { HistoryDrawer } from '@/components/thread/history/HistoryDrawer';
import { ParameterDrawer } from '@/components/thread/parameter/ParameterDrawer';
import { QueryForm } from '@/components/thread/QueryForm';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';
import { ThreadTabs } from '@/components/thread/ThreadTabs';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

export const UIRefreshThreadPage = () => {
    const models = useAppContext((state) => state.models);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);
    const selectedModel = useAppContext((state) => state.selectedModel);

    const onModelChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value);
    };

    const isDesktop = useDesktopOrUp();

    return (
        <>
            <MetaTags title="Ai2 Playground" />
            <Card
                variant="elevation"
                elevation={0}
                sx={{
                    flexGrow: '1',
                    gridArea: 'content',
                }}>
                <Stack
                    gap={2}
                    sx={(theme) => ({
                        containerName: 'thread-page',
                        containerType: 'inline-size',

                        backgroundColor: 'background.default',

                        paddingBlockStart: 1,
                        paddingBlockEnd: 2,
                        paddingInline: 2,

                        [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                            paddingBlockStart: 2,
                            paddingBlockEnd: 4,
                            paddingInline: 4,
                        },

                        height: 1,
                    })}>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between">
                        <>
                            {models.length > 1 ? (
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
                            ) : (
                                <Typography key={models[0].name}>{models[0].name}</Typography>
                            )}
                        </>
                        <ThreadPageControls />
                    </Stack>

                    <Outlet />
                    <QueryForm />

                    <Typography
                        variant="caption"
                        sx={(theme) => ({
                            [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: {
                                display: 'none',
                            },
                        })}>
                        OLMo is experimental and can make mistakes. Consider fact-checking your
                        results.
                    </Typography>
                </Stack>
            </Card>

            {isDesktop ? (
                <ThreadTabs />
            ) : (
                <>
                    <HistoryDrawer />
                    <AttributionDrawer />
                    <ParameterDrawer />
                </>
            )}
        </>
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
