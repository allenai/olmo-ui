import type { ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
// !!! Replace this with the correct provider
import { SingleThreadProvider as AgentChatQueryContextProvider } from '@/contexts/SingleThreadProvider';
//
import { StreamEventRegistryProvider } from '@/contexts/StreamEventRegistry';

export const AgentChatPage = (): ReactNode => {
    const { agentId: _agentId, threadId: _threadId } = useParams<{
        agentId?: string;
        threadId?: string;
    }>();

    return (
        <StreamEventRegistryProvider>
            <AgentChatQueryContextProvider>
                <MetaTags />
                <PageContainer>
                    <ContentContainer>
                        <Outlet />
                        <QueryFormContainer />
                    </ContentContainer>

                    <ResponsiveControlsDrawer />
                </PageContainer>
            </AgentChatQueryContextProvider>
        </StreamEventRegistryProvider>
    );
};
