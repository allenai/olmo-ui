import type { ReactNode } from 'react';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { stack } from '@/styled-system/patterns';

import { ToolCallWidget } from './ToolCallWidget';

interface AllToolCallsProps {
    toolCalls?: readonly SchemaToolCall[];
}

export default function AllToolCalls({ toolCalls }: AllToolCallsProps): ReactNode {
    if (toolCalls == null) {
        return null;
    }

    return (
        <div className={stack({ gap: '4' })}>
            {toolCalls.map((toolCall) => (
                <ToolCallWidget toolCall={toolCall} key={toolCall.toolCallId} />
            ))}
        </div>
    );
}
