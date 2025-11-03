import { css } from '@allenai/varnish-panda-runtime/css';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import { LegalNotice } from '@/components/thread/LegalNotice/LegalNotice';
import { ThreadPlaceholderContentWrapper } from '@/components/thread/ThreadPlaceholder/ThreadPlaceholderContentWrapper';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { useAgents } from '@/pages/agent/useAgents';

import { PromptTemplate } from './PromptTemplateList';
import { PromptTemplatesAndSpinner } from './PromptTemplatesAndSpinner';

const promptTemplates: PromptTemplate[] = [];

export const AgentPlaceholder = () => {
    const { agentId } = useParams<{ agentId: string }>();
    const { remoteState } = useQueryContext();
    const agent = useAgents({
        select: (agents) => agents.find((agent) => agent.id === agentId),
    });
    const isLoading = remoteState === RemoteState.Loading;

    return (
        <ThreadPlaceholderContentWrapper>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="start"
                alignItems="center"
                height={1}
                flex={1}
                gridRow="1/-1"
                gridColumn="span 2">
                <LegalNotice />
                <div
                    className={css({
                        marginTop: '[10dvh]', // responsive size
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1',
                        textAlign: 'center',
                        paddingBottom: '6',
                    })}>
                    <p>{agent?.description}</p>
                    <PromptTemplatesAndSpinner
                        agentId={agentId}
                        promptTemplates={promptTemplates}
                        isLoading={isLoading}
                    />
                </div>
            </Box>
        </ThreadPlaceholderContentWrapper>
    );
};
