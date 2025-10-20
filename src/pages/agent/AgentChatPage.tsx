import type { ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { ResponsiveControlsDrawer } from '@/components/ResponsiveControlsDrawer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';

import { AgentLayout } from './AgentLayout';

export const AgentChatPage = (): ReactNode => {
    const { agentId, threadId } = useParams<{ agentId?: string; threadId?: string }>();

    return (
        <AgentLayout agentId={agentId} threadId={threadId}>
            <ContentContainer>
                <Outlet />
                <QueryFormContainer />
            </ContentContainer>

            <ResponsiveControlsDrawer />
        </AgentLayout>
    );
};
