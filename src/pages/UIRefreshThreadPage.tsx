import { alpha, Box, Card, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { MetaTags } from '@/components/MetaTags';
import {
    DesktopAttributionDrawer,
    MobileAttributionDrawer,
} from '@/components/thread/attribution/drawer/AttributionDrawer';
import { LegalNotice } from '@/components/thread/LegalNotice';
import { ModelSelectionDisplay } from '@/components/thread/ModelSelectionDisplay';
import {
    DesktopParameterDrawer,
    MobileParameterDrawer,
} from '@/components/thread/parameter/ParameterDrawer';
import { QueryForm } from '@/components/thread/QueryForm';
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
                sx={(theme) => ({
                    paddingBlockStart: 1,
                    paddingBlockEnd: 2,
                    paddingInline: 2,
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        gridArea: 'content',
                        display: 'grid',
                        gridRowGap: '1rem',
                        transition: '300ms',
                        gridTemplateColumns: '1fr auto',
                        gridTemplateRows: 'auto 1fr',
                        gridTemplateAreas: '"controls ." "content drawer"',
                    },
                })}>
                <ModelSelectionDisplay
                    models={models}
                    selectedModel={selectedModel}
                    onModelChange={onModelChange}
                    label="Model"
                    sx={{ gridArea: 'controls' }}
                />
                <Stack
                    gap={2}
                    sx={{
                        containerName: 'thread-page',
                        containerType: 'inline-size',

                        backgroundColor: 'transparent',
                        height: 1,
                        // these are needed because grid automatically sets them to auto, which breaks the overflow behavior we want
                        minHeight: 0,
                        minWidth: 0,

                        gridArea: 'content',
                    }}>
                    <Box
                        sx={(theme) => ({
                            display: 'grid',
                            gridTemplateColumns: '1fr max-content',
                            columnGap: 1,
                            width: '100%',
                            margin: '0 auto',
                            paddingInline: 2,
                            [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                                paddingInline: 5,
                            },
                        })}>
                        <ModelSelectionDisplay
                            models={models}
                            selectedModel={selectedModel}
                            onModelChange={onModelChange}
                            label="Model"
                        />
                    </Box>
                    <Outlet />
                    <Stack
                        gap={1}
                        sx={{
                            width: '100%',
                            maxWidth: '750px',
                            margin: '0 auto',
                        }}>
                        <QueryForm />
                        <Typography
                            component="p"
                            variant="caption"
                            textAlign="center"
                            sx={(theme) => ({
                                display: 'block',
                                fontSize: '0.7rem',
                                lineHeight: '1.5',
                                margin: '0',
                                color: alpha(
                                    theme.palette.text.primary,
                                    theme.palette.mode === 'dark' ? 0.5 : 0.75
                                ),
                            })}>
                            Ai2 Playground is a free scientific research and educational tool;
                            always fact-check your results.
                        </Typography>
                    </Stack>
                </Stack>

                {isDesktop ? (
                    <>
                        <DesktopParameterDrawer />
                        <DesktopAttributionDrawer />
                    </>
                ) : (
                    <>
                        <MobileAttributionDrawer />
                        <MobileParameterDrawer />
                    </>
                )}
            </Card>
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
