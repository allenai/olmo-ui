import { Box, Card, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { MetaTags } from '@/components/MetaTags';
import { AttributionDrawer } from '@/components/thread/attribution/drawer/AttributionDrawer';
import { ModelSelectionDisplay } from '@/components/thread/ModelSelectionDisplay';
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
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr max-content',
                            columnGap: 1,
                        }}>
                        <ModelSelectionDisplay
                            models={models}
                            selectedModel={selectedModel}
                            onModelChange={onModelChange}
                            label="Model"
                            shouldOnlyShowAtDesktop={true}
                        />
                        <ThreadPageControls />
                        <ModelSelectionDisplay
                            models={models}
                            selectedModel={selectedModel}
                            onModelChange={onModelChange}
                            label="Model"
                            shouldOnlyShowAtDesktop={false}
                        />
                    </Box>

                    <Outlet />
                    <QueryForm />

                    <Typography
                        variant="caption"
                        sx={(theme) => ({
                            [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: {
                                display: 'none',
                            },
                        })}>
                        Ai2 models are experimental and can make mistakes. Consider fact-checking
                        your results.
                    </Typography>
                </Stack>
            </Card>

            {isDesktop ? (
                <ThreadTabs />
            ) : (
                <>
                    <AttributionDrawer />
                    <ParameterDrawer />
                </>
            )}
        </>
    );
};

export const playgroundLoader: LoaderFunction = async ({ params }) => {
    const { models, getAllModels, resetSelectedThreadState, resetAttribution, getSchema, schema } =
        appContext.getState();

    const promises = [];

    if (models.length === 0) {
        promises.push(getAllModels());
    }

    if (schema == null) {
        promises.push(getSchema());
    }

    if (params.id === undefined) {
        resetSelectedThreadState();
        resetAttribution();
    }

    await Promise.all(promises);

    return null;
};

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
