import type { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext, useAppContext } from '@/AppContext';
import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { SingleThreadModelSelect } from '@/components/thread/ModelSelect/ThreadModelSelect';
import { getModelsQueryOptions, isModelVisible } from '@/components/thread/ModelSelect/useModels';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

export const UIRefreshThreadPage = () => {
    // somewhere that handles model selection
    const selectedModelFamilyId = useAppContext((state) => state.selectedModel?.family_id);
    return (
        <>
            <MetaTags />
            <PageContainer>
                <ContentContainer>
                    <SingleThreadModelSelect />
                    <Outlet />
                    <QueryFormContainer selectedModelFamilyId={selectedModelFamilyId} />
                </ContentContainer>

                <ResponsiveControlsDrawer />
            </PageContainer>
        </>
    );
};

// should be external
const MODEL_DEPRECATION_NOTICE_GIVEN_KEY = 'model-deprecation-notice-2025-05-09T07:00:00Z';
const MODEL_DEPRECATION_DATE = new Date('2025-05-09T07:00:00Z');

const createModelDeprecationNotice = () => {
    const modelsBeingDeprecated = [
        'OLMo 2 13B Instruct',
        'Llama Tülu 3 70B',
        'Llama Tülu 3 8B',
        'OLMoE 1B 7B 0125',
    ];

    return `We are reworking our model hosting system and will be removing the following models on ${MODEL_DEPRECATION_DATE.toLocaleDateString()}: ${modelsBeingDeprecated.join(', ')}`;
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
