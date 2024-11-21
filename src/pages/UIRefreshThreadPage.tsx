import { Box, Card, SelectChangeEvent, Stack } from '@mui/material';
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
                    gridArea: 'content',
                    paddingBlockStart: 2,
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        paddingBlockStart: 0,
                        display: 'grid',
                        transition: '300ms',
                        gridTemplateColumns: '1fr auto',
                    },
                })}>
                <Stack
                    gap={2}
                    sx={{
                        containerName: 'thread-page',
                        containerType: 'inline-size',

                        backgroundColor: 'transparent',
                        height: 1,
                        paddingBlockStart: 1,
                        // these are needed because grid automatically sets them to auto, which breaks the overflow behavior we want
                        minHeight: 0,
                        minWidth: 0,
                    }}>
                    <Box
                        sx={(theme) => ({
                            display: 'grid',
                            gridTemplateColumns: '1fr max-content',
                            columnGap: 1,
                            // width: '100%',
                            flexGrow: 1,
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
                            paddingInline: 2,
                            width: '100%',
                            maxWidth: '750px',
                            margin: '0 auto',
                            paddingBlockEnd: 2,
                        }}>
                        <QueryForm />
                        <LegalNotice />
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
