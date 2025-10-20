import { Outlet, useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { SingleThreadModelSelect } from '@/components/thread/ModelSelect/ThreadModelSelect';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { useQueryContext } from '@/contexts/QueryContext';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';

import { PlaygroundLoaderData } from './playgroundLoader';

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
    const loaderData = useLoaderData() as PlaygroundLoaderData;

    return (
        <SingleThreadProvider initialState={loaderData}>
            <UIRefreshThreadPageContent />
        </SingleThreadProvider>
    );
};
