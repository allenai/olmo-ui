import { css } from '@allenai/varnish-panda-runtime/css';
import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { Ai2MarkLogoSVG } from '@/components/svg/Ai2MarkLogoSVG';

import { AgentCard } from './AgentCard';
import { AgentLayout } from './AgentLayout';
import { type AgentLoaderData } from './agentPageLoader';

const agentPageContentWrapper = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
    paddingBlockStart: '4',
    paddingInline: '4',
    overflow: 'auto',
});

const agentCardListClassName = css({
    display: 'grid',
    gridTemplateColumns: {
        base: '1fr',
        md: 'repeat(3, 1fr)',
    },
    gap: '3',
    alignSelf: 'center',
    justifyItems: 'center',
    width: '[100%]',
    maxWidth: 'breakpoint-lg',
    marginInline: 'auto',
});

export const AgentPage = () => {
    const agentPageData = useLoaderData() as AgentLoaderData;
    return (
        <AgentLayout>
            <ContentContainer>
                <div className={agentPageContentWrapper}>
                    <Ai2MarkLogoSVG
                        title="Ai2"
                        sx={{
                            display: { xs: 'none', lg: 'block' },
                            marginInline: 'auto',
                        }}
                    />
                    <Typography variant="h1" component="h2" sx={{ textAlign: 'center' }}>
                        Agents
                    </Typography>
                    <div className={agentCardListClassName}>
                        {agentPageData.agents.map((agent) => (
                            <AgentCard key={agent.name} type="playground" {...agent} />
                        ))}
                        {agentPageData.agentLinks.map((agent) => (
                            <AgentCard key={agent.name} type="link" {...agent} isExternal />
                        ))}
                    </div>
                </div>
            </ContentContainer>
        </AgentLayout>
    );
};
