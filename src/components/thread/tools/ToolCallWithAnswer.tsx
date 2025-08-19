import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { useThread } from '@/api/playgroundApi/thread';

import { ToolCallWidget } from './ToolCallWidget';

const useToolCallAnswer = (threadId: string, toolCallId: string): string | undefined => {
    const { data: lastMessageWithMatchingToolCall } = useThread(threadId, (thread) =>
        thread.messages.findLast(
            (message) =>
                message.role === 'tool_call_result' &&
                message.toolCalls?.some((toolCall) => toolCall.toolCallId === toolCallId)
        )
    );

    return lastMessageWithMatchingToolCall?.content;
};

interface ToolCallWithAnswerProps {
    toolCall: SchemaToolCall;
    threadId: string;
}

export const ToolCallWithAnswer = ({ toolCall, threadId }: ToolCallWithAnswerProps) => {
    const answer = useToolCallAnswer(threadId, toolCall.toolCallId);

    return <ToolCallWidget toolCall={toolCall} answer={answer} />;
};
