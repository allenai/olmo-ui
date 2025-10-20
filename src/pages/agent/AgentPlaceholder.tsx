import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { ImageSpinner } from '@/components/ImageSpinner';
import { ThreadMaxWidthContainer } from '@/components/thread/ThreadDisplay/ThreadMaxWidthContainer';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';

import { useAgents } from './useAgents';

export const AgentPlaceholder = () => {
    const { agentId } = useParams<{ agentId?: string }>();
    const { remoteState } = useQueryContext();
    const agent = useAgents({
        select: (agents) => agents.find((agent) => agent.id === agentId),
    });
    const isLoading = remoteState === RemoteState.Loading;

    return (
        <Box
            height={1}
            data-testid="thread-placeholder"
            overflow="scroll"
            sx={{
                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
                paddingInline: 2,

                // TODO: https://github.com/allenai/olmo-ui/issues/825 Combine this and the ThreadDisplay layout
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarGutter: 'stable',
            }}>
            <ThreadMaxWidthContainer sx={{ height: '100%' }}>
                {/*
                <Box gridColumn="2 / -1">
                    <LegalNotice />
                </Box>
                */}
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    marginTop="5dvh"
                    marginBottom={4}
                    height={1}
                    gap={8}
                    flex={1}
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
                </Box>
            </ThreadMaxWidthContainer>
        </Box>
    );
};
