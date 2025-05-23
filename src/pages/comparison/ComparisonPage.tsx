import { Outlet } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { MainContentContainer } from '@/components/thread/MainContentContainer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';

export const ComparisonPage = () => {
    return (
        <>
            <MetaTags />
            <ContentContainer>
                <MainContentContainer>
                    <Outlet />
                    <QueryFormContainer selectedModelFamilyId={null} />
                </MainContentContainer>

                <ResponsiveControlsDrawer />
            </ContentContainer>
        </>
    );
};
