import { useParams } from 'react-router-dom';

import { useThread } from '@/api/playgroundApi/thread';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';
import { useStreamEvent } from '@/contexts/StreamEventRegistry';
import { AGENT_CHAT_STREAM_MUTATION_KEY } from '@/contexts/streamMessage/useStreamAgentMessage';
import { RemoteState } from '@/contexts/util';
import { ThreadViewProvider, useThreadView } from '@/pages/comparison/ThreadViewContext';

import { AgentChatPageParams } from './agentTypes';

const ThreadDisplayContent = () => {
    const {
        threadId: selectedThreadRootId,
        streamingMessageId,
        isUpdatingMessageContent,
        remoteState,
    } = useThreadView();

    // Handle scroll to new user message
    useStreamEvent('onNewUserMessage', (_threadViewId: string) => {
        const element = document.querySelector('[data-testid="thread-display"]');
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
            });
        }
    });

    const { data, error: _error } = useThread(selectedThreadRootId);
    // TODO handle errors: https://github.com/allenai/playground-issues-repo/issues/412
    const messages = data?.messages ?? [];
    const childMessageIds = messages.map((message) => message.id);

    return (
        <ThreadDisplay
            childMessageIds={childMessageIds}
            streamingMessageId={streamingMessageId ?? null}
            isUpdatingMessageContent={isUpdatingMessageContent ?? false}
            hasError={remoteState === RemoteState.Error}
            shouldShowAttributionHighlightDescription={false}
        />
    );
};

export const AgentChatThreadContainer = () => {
    const { threadId = '' } = useParams<AgentChatPageParams>();

    return (
        <ThreadViewProvider
            threadId={threadId}
            threadViewId="0"
            mutationKey={AGENT_CHAT_STREAM_MUTATION_KEY}>
            <ThreadDisplayContent />
        </ThreadViewProvider>
    );
};
