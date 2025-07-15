import { Outlet, useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { ComparisonProvider } from '@/contexts/ComparisonProvider';
import { CompareModelState } from '@/slices/CompareModelSlice';

import { ComparisonLoaderData } from './comparisonPageLoader';

// Convert CompareModelState[] to ComparisonProvider's initial state format
function convertLoaderDataToState(comparisonModels: CompareModelState[]) {
    const state: Record<string, { modelId?: string; threadId?: string }> = {};

    comparisonModels.forEach((compareModel) => {
        state[compareModel.threadViewId] = {
            modelId: compareModel.model?.id,
            threadId: compareModel.rootThreadId,
        };
    });

    return state;
}

const ComparisonPageInner = () => {
    return (
        <>
            <MetaTags />
            <PageContainer>
                <ContentContainer>
                    <Outlet />
                    <QueryFormContainer selectedModelFamilyId={null} />
                </ContentContainer>

                <ResponsiveControlsDrawer />
            </PageContainer>
        </>
    );
};

export const ComparisonPage = () => {
    const loaderData = useLoaderData() as ComparisonLoaderData;

    // Convert loader data to initialState format if available
    const initialState = loaderData.comparisonModels
        ? convertLoaderDataToState(loaderData.comparisonModels)
        : undefined;

    return (
        <ComparisonProvider initialState={initialState}>
            <ComparisonPageInner />
        </ComparisonProvider>
    );
};
