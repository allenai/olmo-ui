import type { ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { SingleThreadProvider } from '@/contexts/SingleThreadProvider';

export const AgentChatPage = (): ReactNode => {
    const { agentId } = useParams<{ agentId: string; threadId: string }>();

    return (
        <SingleThreadProvider initialState={{ selectedModelOrAgentId: agentId }} isAgentThread>
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
