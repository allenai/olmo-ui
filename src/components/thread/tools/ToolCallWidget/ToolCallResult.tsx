import { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';

import { ToolCallAnswer } from './ToolCallAnswer';
import { ToolCallUserResponse } from './ToolCallUserResponse';

interface ToolCallResultProps {
    toolCall: SchemaToolCall;
    answer?: string;
}

export const ToolCallResult = ({ toolCall, answer }: ToolCallResultProps) => {
    if (toolCall.toolSource !== 'user_defined' || answer) {
        return <ToolCallAnswer>{answer}</ToolCallAnswer>;
    }
    return <ToolCallUserResponse toolCallId={toolCall.toolCallId} />;
};
