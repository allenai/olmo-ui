import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';

import { ToolCallUserResponse, ToolCallWidget } from './ToolCallWidget';

interface ToolCallUserWidgetProps {
    toolCall: SchemaToolCall;
}

export const ToolCallUserWidget = ({ toolCall }: ToolCallUserWidgetProps) => {
    return (
        <ToolCallWidget toolCall={toolCall}>
            <ToolCallUserResponse />
        </ToolCallWidget>
    );
};
