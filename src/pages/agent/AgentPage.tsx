import { css } from '@allenai/varnish-panda-runtime/css';
import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { Ai2MarkLogoSVG } from '@/components/svg/Ai2MarkLogoSVG';

import { AgentCard } from './AgentCard';
import { type AgentLoaderData } from './agentPageLoader';

const agentPageContentWrapper = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
    paddingBlockStart: '4',
    paddingInline: {
        base: '4',
        md: '8',
    },
    overflow: 'auto',
    alignItems: 'center',
    maxWidth: 'breakpoint-lg',
    marginInline: 'auto',
});

const agentCardListClassName = css({
    display: 'grid',
    gridTemplateColumns: {
        base: '1fr 2fr',
        md: 'repeat(3, 1fr)',
    },
    gap: '3',
    alignSelf: 'center',
    justifyItems: 'center',
    width: '[100%]',
});

export const AgentPage = () => {
    const agentPageData = useLoaderData() as AgentLoaderData;
    return (
        <>
            <MetaTags />
            <PageContainer>
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
                        <Typography variant="h4" component="p">
                            Explore our agents
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
            </PageContainer>
        </>
    );
};
