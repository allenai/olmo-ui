import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { ImageSpinner } from '@/components/ImageSpinner';
import { ThreadPlaceholderContentWrapper } from '@/components/thread/ThreadPlaceholder/ThreadPlaceholderContentWrapper';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { useAgents } from '@/pages/agent/useAgents';

const promptTemplates = [
    {
        id: 'p_tmpl_123',
        content: 'ASD',
    },
    {
        id: 'p_tmpl_456',
        content: 'BLAH',
    },
];

export const AgentPlaceholder = () => {
    const { agentId } = useParams<{ agentId?: string }>();
    const { remoteState } = useQueryContext();
    const agent = useAgents({
        select: (agents) => agents.find((agent) => agent.id === agentId),
    });
    const isLoading = remoteState === RemoteState.Loading;

    return (
        <ThreadPlaceholderContentWrapper>
            {/*
            <Box gridColumn="2 / -1">
                <LegalNotice />
            </Box>
            */}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="start"
                alignItems="center"
                paddingTop="5dvh"
                paddingBottom={4}
                height={1}
                gap={8}
                flex={1}
                gridRow="1/-1"
                gridColumn="span 2">
                <ImageSpinner
                    src="/ai2-monogram.svg"
                    isAnimating={isLoading}
                    width={70}
                    height={70}
                    alt=""
                />
                <Stack alignItems="center" gap={2}>
                    <Typography variant="h2">{agent?.name}</Typography>
                    <p>{agent?.description}</p>
                </Stack>
                {promptTemplates.length > 0 ? (
                    <>
                        <Stack>
                            <p>
                                Start with one of these sample prompts, or upload an image and ask a
                                question below.
                            </p>
                        </Stack>
                        {promptTemplates.map(({ id, content }) => (
                            <div key={id}>{content}</div>
                        ))}
                    </>
                ) : null}
            </Box>
        </ThreadPlaceholderContentWrapper>
    );
};
