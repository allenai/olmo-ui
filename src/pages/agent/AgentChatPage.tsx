import type { ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { AgentChatProvider } from '@/contexts/AgentChatProvider/AgentChatProvider';
import { StreamEventRegistryProvider } from '@/contexts/StreamEventRegistry';

export const AgentChatPage = (): ReactNode => {
    const { agentId, threadId } = useParams<{
        agentId?: string;
        threadId?: string;
    }>();

    return (
        <StreamEventRegistryProvider>
            <AgentChatProvider agentId={agentId} threadId={threadId}>
                <MetaTags />
                <PageContainer>
                    <ContentContainer>
                        <Outlet />
                        <QueryFormContainer />
                    </ContentContainer>

                    <ResponsiveControlsDrawer />
                </PageContainer>
            </AgentChatProvider>
        </StreamEventRegistryProvider>
    );
};
