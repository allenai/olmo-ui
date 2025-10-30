import { css } from '@allenai/varnish-panda-runtime/css';
import { Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { Agent } from '@/api/playgroundApi/additionalTypes';
import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { QueryFormContainer } from '@/components/thread/QueryForm/QueryFormContainer';
import { AgentChatProvider } from '@/contexts/AgentChatProvider/AgentChatProvider';
import { StreamEventRegistryProvider } from '@/contexts/StreamEventRegistry';
import { AgentParametersDrawer } from '@/pages/agent/AgentParametersDrawer/AgentParametersDrawer';

import { useAgents } from '../useAgents';

export const AgentChatPage = (): ReactNode => {
    const { agentId, threadId } = useParams<{
        agentId?: string;
        threadId?: string;
    }>();

    const agent = useAgents({
        select: (agents) => agents.find((agent) => agent.id === agentId),
    });

    return (
        <StreamEventRegistryProvider>
            <AgentChatProvider agentId={agentId} threadId={threadId}>
                <MetaTags />
                <PageContainer>
                    <ContentContainer>
                        <AgentName agent={agent} />
                        <Outlet />
                        <QueryFormContainer />
                    </ContentContainer>

                    <AgentParametersDrawer />
                </PageContainer>
            </AgentChatProvider>
        </StreamEventRegistryProvider>
    );
};

const AgentName = ({ agent }: { agent?: Agent }) => {
    return (
        <div
            className={css({
                paddingBlockEnd: '4',
                marginInline: 'auto',
                width: '[100%]',
                maxWidth: '[750px]',
            })}>
            <Typography component="h2" variant="h5" marginInline={2}>
                {agent?.name}
            </Typography>
        </div>
    );
};
