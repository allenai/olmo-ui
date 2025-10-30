import { css } from '@allenai/varnish-panda-runtime/css';
import { Box, Stack, Typography } from '@mui/material';
import { generatePath, useParams } from 'react-router-dom';

import { ImageSpinner } from '@/components/ImageSpinner';
import { LegalNotice } from '@/components/thread/LegalNotice/LegalNotice';
import { LinkCard } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCard';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';
import { ThreadPlaceholderContentWrapper } from '@/components/thread/ThreadPlaceholder/ThreadPlaceholderContentWrapper';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { useAgents } from '@/pages/agent/useAgents';

type PromptTemplates = { id: string; content: string; imageUrl?: string };

const promptTemplates: PromptTemplates[] = [
    {
        id: 'p_tmpl_123',
        content: 'ASD',
    },
    {
        id: 'p_tmpl_456',
        content: 'BLAH',
    },
];

const makeAgentTemplatePath = ({
    agentId,
    templateId,
}: {
    agentId: string;
    templateId: string;
}) => {
    const path = generatePath(links.agent.agent, {
        agentId,
    });
    return `${path}?template=${templateId}`;
};

type PromptTemplateOrLoadingProps = {
    agentId?: string;
    promptTemplates?: PromptTemplates[];
    isLoading?: boolean;
};

const PromptTemplateOrLoading = ({
    agentId,
    promptTemplates,
    isLoading,
}: PromptTemplateOrLoadingProps) => {
    if (isLoading) {
        return (
            <ImageSpinner
                src="/ai2-monogram.svg"
                isAnimating={isLoading}
                width={70}
                height={70}
                marginTop={40}
                alt=""
                marginBlock="auto" // maybe
            />
        );
    }

    if (agentId == null || !promptTemplates?.length) {
        return null;
    }

    return (
        <>
            <p>
                Start with one of these sample prompts, or upload an image and ask a question below.
            </p>
            <LinkCardList className={css({ width: '[100%]', marginTop: '[40px]' })}>
                {promptTemplates.map(({ id, content, imageUrl }) => (
                    <LinkCard
                        key={id}
                        url={makeAgentTemplatePath({
                            agentId,
                            templateId: id,
                        })}
                        image={imageUrl}>
                        {content}
                    </LinkCard>
                ))}
            </LinkCardList>
        </>
    );
};

export const AgentPlaceholder = () => {
    const { agentId } = useParams<{ agentId?: string }>();
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
                <Stack alignItems="center" gap={2}>
                    <Typography component="h2" variant="h3">
                        {agent?.name}
                    </Typography>
                    <LegalNotice />
                </Stack>
                <div
                    className={css({
                        marginTop: '[10dvh]', // responsive size
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                    })}>
                    <p>{agent?.description}</p>
                    {promptTemplates.length > 0 ? (
                        <>
                            <PromptTemplateOrLoading
                                agentId={agentId}
                                isLoading={isLoading}
                                promptTemplates={promptTemplates}
                            />
                        </>
                    ) : null}
                </div>
            </Box>
        </ThreadPlaceholderContentWrapper>
    );
};
