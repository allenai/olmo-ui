import type { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, Outlet, ShouldRevalidateFunction, useLoaderData } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext } from '@/AppContext';
import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { SingleThreadModelSelect } from '@/components/thread/ModelSelect/ThreadModelSelect';
import { getModelsQueryOptions, isModelVisible } from '@/components/thread/ModelSelect/useModels';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { useQueryContext } from '@/contexts/QueryContext';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

interface PlaygroundLoaderData {
    preselectedModelId?: string;
}

// Inner component that has access to QueryContext
const UIRefreshThreadPageContent = () => {
    const queryContext = useQueryContext();

    const selectedModel = queryContext.getThreadViewModel();
    const selectedModelFamilyId = selectedModel?.family_id;

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

export const UIRefreshThreadPage = () => {
    const loaderData = useLoaderData() as PlaygroundLoaderData | null;

    return (
        <SingleThreadProvider
            initialState={{
                selectedModelId: loaderData?.preselectedModelId,
            }}>
            <UIRefreshThreadPageContent />
        </SingleThreadProvider>
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
        const { resetSelectedThreadState, resetAttribution, getSchema, schema } =
            appContext.getState();

        const promises = [];

        const models = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];

        if (schema == null) {
            promises.push(getSchema());
        }

        if (params.id === undefined) {
            resetSelectedThreadState();
            resetAttribution();
        }

        await Promise.all(promises);

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

        // TODO: Move this model validation and fallback logic to SingleThreadProvider?
        // Similar logic already exists there.

        // Determine preselected model from URL
        const preselectedModelId = new URL(request.url).searchParams.get('model');
        let finalPreselectedModelId: string | undefined;

        if (preselectedModelId != null) {
            const selectedModel = models.find((model) => model.id === preselectedModelId);
            if (selectedModel != null) {
                finalPreselectedModelId = selectedModel.id;
            } else {
                // Fallback to first visible model if specified model not found
                const fallbackModel = models.filter(isModelVisible)[0];
                finalPreselectedModelId = fallbackModel.id;
            }
        }

        // Return initialization data for SingleThreadProvider
        const loaderData: PlaygroundLoaderData = {
            preselectedModelId: finalPreselectedModelId,
        };

        return loaderData;
    };

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
