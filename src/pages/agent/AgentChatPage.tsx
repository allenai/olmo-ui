import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';

export const AgentChatPage = (): ReactNode => {
    return (
        <SingleThreadProvider>
            <MetaTags />
            <PageContainer>
                <ContentContainer>
                    <Outlet />
                    <QueryFormContainer />
                </ContentContainer>

                <ResponsiveControlsDrawer />
            </PageContainer>
        </SingleThreadProvider>
    );
};
