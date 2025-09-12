import type { ReactNode } from 'react';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { stack } from '@/styled-system/patterns';

import { ToolCallWithAnswer } from './ToolCallWithAnswer';

interface AllToolCallsProps {
    toolCalls?: readonly SchemaToolCall[];
    threadId: string;
}

export default function AllToolCalls({ toolCalls, threadId }: AllToolCallsProps): ReactNode {
    if (toolCalls == null) {
        return null;
    }

    return (
        <div className={stack({ gap: '4', marginBottom: '4' })}>
            {toolCalls.map((toolCall) => (
                <ToolCallWithAnswer
                    toolCall={toolCall}
                    threadId={threadId}
                    key={toolCall.toolCallId}
                />
            ))}
        </div>
    );
}
