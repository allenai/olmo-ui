import { parse } from 'partial-json';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';

export const mapToolCallArgs = (toolCall: SchemaToolCall): Record<string, unknown> | undefined => {
    if (typeof toolCall.args === 'string') {
        return parse(toolCall.args) as Record<string, unknown>;
    } else {
        return toolCall.args ?? undefined;
    }
};
