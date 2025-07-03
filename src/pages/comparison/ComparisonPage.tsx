import { Outlet } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { ComparisonProvider } from '@/contexts/ComparisonProvider';

export const ComparisonPage = () => {
    return (
        <ComparisonProvider>
            <MetaTags />
            <PageContainer>
                <ContentContainer>
                    <Outlet />
                    <QueryFormContainer selectedModelFamilyId={null} />
                </ContentContainer>

                <ResponsiveControlsDrawer />
            </PageContainer>
        </ComparisonProvider>
    );
};
