import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import type { Agent } from '@/api/playgroundApi/additionalTypes';
import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';
import { AgentCard } from '@/pages/agent/components/AgentCard';

type AgentLoaderData = {
    agents: Agent[];
    agentLinks: Agent[];
};

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
    maxWidth: 'breakpoint-sm',
    width: '[100%]',
    marginInline: 'auto',
    marginTop: '[10dvh]',
});

const agentCardListClassName = css({
    gap: '8',
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
                        <Typography variant="h1" component="h2" sx={{ textAlign: 'center' }}>
                            Agents
                        </Typography>
                        <Typography variant="h4" component="p">
                            Explore our agents
                        </Typography>
                        <LinkCardList
                            className={cx(agentCardListClassName, css({ marginTop: '[60px]' }))}>
                            {agentPageData.agents.map((agent) => (
                                <AgentCard
                                    key={agent.name}
                                    type="playground"
                                    id={agent.id}
                                    name={agent.name}
                                    description={agent.shortDescription}
                                    informationUrl={agent.information_url}
                                />
                            ))}
                        </LinkCardList>
                        {agentPageData.agentLinks.length > 0 ? (
                            <LinkCardList className={agentCardListClassName}>
                                {agentPageData.agentLinks.map((agent) => (
                                    <AgentCard
                                        key={agent.name}
                                        type="link"
                                        id={agent.id}
                                        name={agent.name}
                                        description={agent.shortDescription}
                                        informationUrl={agent.information_url}
                                        isExternal
                                    />
                                ))}
                            </LinkCardList>
                        ) : null}
                    </div>
                </ContentContainer>
            </PageContainer>
        </>
    );
};
