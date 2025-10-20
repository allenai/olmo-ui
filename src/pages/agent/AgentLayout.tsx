import { PropsWithChildren } from 'react';

import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { AgentChatQueryContextProvider } from '@/contexts/AgentQueryContextProvider/AgentQueryContextProvider';
import { StreamEventRegistryProvider } from '@/contexts/StreamEventRegistry';

export const AgentLayout = ({
    agentId,
    threadId,
    children,
}: PropsWithChildren<{ agentId?: string; threadId?: string }>) => {
    return (
        <StreamEventRegistryProvider>
            <AgentChatQueryContextProvider agentId={agentId} threadId={threadId}>
                <MetaTags />
                <PageContainer>{children}</PageContainer>
            </AgentChatQueryContextProvider>
        </StreamEventRegistryProvider>
    );
};
