import { Card, Stack } from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { MetaTags } from '@/components/MetaTags';
import {
    DesktopAttributionDrawer,
    MobileAttributionDrawer,
} from '@/components/thread/attribution/drawer/AttributionDrawer';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
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

const MODEL_DEPRECATION_NOTICE_GIVEN_KEY = 'model-deprecation-notice-2025-05-07T17:37:24.875Z';

const createModelDeprecationNotice = () => {
    const modelsBeingDeprecated = [
        'OLMo 2 13B Instruct',
        'Llama Tülu 3 70B',
        'Llama Tülu 3 8B',
        'OLMoE 1B 7B 0125',
    ];

    return `The following models will be removed on May 16: ${modelsBeingDeprecated.join(', ')}`;
};

export const playgroundLoader: LoaderFunction = async ({ params, request }) => {
    const {
        models,
        getAllModels,
        resetSelectedThreadState,
        resetAttribution,
        getSchema,
        schema,
        abortPrompt,
    } = appContext.getState();

    const promises = [];

    // abort the current streaming prompt if there is any
    abortPrompt();

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

    const preselectedModelId = new URL(request.url).searchParams.get('model');
    if (preselectedModelId != null) {
        const { models: loadedModels, setSelectedModel } = appContext.getState();

        const selectedModel = loadedModels.find((model) => model.id === preselectedModelId);
        if (selectedModel != null) {
            setSelectedModel(selectedModel.id);
        }
    }

    const hasModelDeprecationNoticeBeenGiven = localStorage.getItem(
        MODEL_DEPRECATION_NOTICE_GIVEN_KEY
    );

    if (!hasModelDeprecationNoticeBeenGiven) {
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
