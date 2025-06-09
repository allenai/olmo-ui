import { Card, Stack } from '@mui/material';
import type { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { MetaTags } from '@/components/MetaTags';
import {
    DesktopAttributionDrawer,
    MobileAttributionDrawer,
} from '@/components/thread/attribution/drawer/AttributionDrawer';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
import { getModelsQueryOptions, isModelVisible } from '@/components/thread/ModelSelect/useModels';
import {
    DesktopParameterDrawer,
    MobileParameterDrawer,
} from '@/components/thread/parameter/ParameterDrawer';
import { QueryForm } from '@/components/thread/QueryForm/QueryForm';
import { QueryFormNotice } from '@/components/thread/QueryForm/QueryFormNotices';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

export const UIRefreshThreadPage = () => {
    const isDesktop = useDesktopOrUp();

    return (
        <>
            <MetaTags />
            <Card
                variant="elevation"
                elevation={0}
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        gridArea: 'content',
                        display: 'grid',
                        transition: '300ms',
                        gridTemplateColumns: '1fr auto',
                        gridTemplateRows: 'auto 1fr',
                        gridTemplateAreas: '"controls ." "thread-content drawer"',
                    },
                })}>
                <Stack
                    gap={0}
                    sx={(theme) => ({
                        containerName: 'thread-page',
                        containerType: 'inline-size',

                        backgroundColor: 'transparent',
                        height: 1,
                        paddingBlockEnd: 2,
                        paddingBlockStart: 2,

                        position: 'relative',
                        overflow: 'hidden',

                        [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                            gridArea: 'thread-content',
                            paddingBlockStart: 6,
                            // these are needed because grid automatically sets them to auto, which breaks the overflow behavior we want
                            minHeight: 0,
                            minWidth: 0,
                        },
                    })}>
                    <ModelSelect />
                    <Outlet />
                    <Stack
                        gap={1}
                        sx={{
                            width: '100%',
                            maxWidth: '750px',
                            margin: '0 auto',
                        }}>
                        <QueryForm />
                        <QueryFormNotice />
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

const MODEL_DEPRECATION_NOTICE_GIVEN_KEY = 'model-deprecation-notice-2025-06-10T22:00:00Z';
const MODEL_DEPRECATION_DATE = new Date('2025-06-10T22:00:00Z');

const createModelDeprecationNotice = () => {
    const modelsBeingDeprecated = ['Llama Tülu 3 405B'];

    return `We are reworking our model hosting system and will be removing the following model(s) on ${MODEL_DEPRECATION_DATE.toLocaleDateString()}: ${modelsBeingDeprecated.join(', ')}`;
};

export const playgroundLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async ({ params, request }) => {
        const { resetSelectedThreadState, resetAttribution, getSchema, schema, abortPrompt } =
            appContext.getState();

        const promises = [];

        // abort the current streaming prompt if there is any
        abortPrompt();

        const models = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];

        if (schema == null) {
            promises.push(getSchema());
        }

        if (params.id === undefined) {
            resetSelectedThreadState();
            resetAttribution();
        }

        await Promise.all(promises);

        const { setSelectedModel, selectedModel } = appContext.getState();
        const preselectedModelId = new URL(request.url).searchParams.get('model');
        if (preselectedModelId != null) {
            const selectedModel = models.find((model) => model.id === preselectedModelId);
            if (selectedModel != null) {
                setSelectedModel(selectedModel);
            } else {
                setSelectedModel(models.filter(isModelVisible)[0]);
            }
        } else if (params.id == null && selectedModel == null) {
            // params.id will be set if we're in a selected thread. The selected thread loader has its own handling, so we only do this if we're at the root!
            const visibleModels = models.filter(isModelVisible);
            setSelectedModel(visibleModels[0]);
        }

        const hasModelDeprecationNoticeBeenGiven = localStorage.getItem(
            MODEL_DEPRECATION_NOTICE_GIVEN_KEY
        );

        if (!hasModelDeprecationNoticeBeenGiven && Date.now() < MODEL_DEPRECATION_DATE.getTime()) {
            const { addSnackMessage } = appContext.getState();
            addSnackMessage({
                id: MODEL_DEPRECATION_NOTICE_GIVEN_KEY,
                message: createModelDeprecationNotice(),
                type: SnackMessageType.Brief,
            });
            localStorage.setItem(MODEL_DEPRECATION_NOTICE_GIVEN_KEY, Date.now().toString());
        }

        return null;
    };

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
