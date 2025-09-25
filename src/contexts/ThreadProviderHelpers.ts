import type { SchemaToolDefinition } from '@/api/playgroundApi/playgroundApiSchema';
import { type FlatMessage, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';

import type { ExtraParameters } from './QueryContext';
import { StreamingThread } from './stream-types';

const getThread = (threadId: string): StreamingThread | undefined => {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
};

const getLastMessageOfThread = (threadId: string): FlatMessage | undefined => {
    const thread = getThread(threadId);

    return thread?.messages.at(-1);
};

export const getNonUserToolsFromThread = (threadId: string | undefined): SchemaToolDefinition[] => {
    if (!threadId) {
        return [];
    }

    const lastMessage = getLastMessageOfThread(threadId);

    const toolDefs = lastMessage?.toolDefinitions || [];
    const userToolDefs = toolDefs.filter((def) => def.toolSource !== 'user_defined');
    return userToolDefs;
};

export const getUserToolDefinitionsFromThread = (
    threadId: string | undefined
): string | undefined => {
    if (!threadId) {
        return;
    }

    const lastMessage = getLastMessageOfThread(threadId);

    const toolDefs = lastMessage?.toolDefinitions || null;
    const userToolDefs = toolDefs
        ?.filter((def) => def.toolSource === 'user_defined')
        .map(({ toolSource, ...def }) => def); // Remove toolSource property

    return userToolDefs ? JSON.stringify(userToolDefs, null, 2) : undefined;
};

export const getExtraParametersFromThread = (
    threadId: string | undefined
): ExtraParameters | undefined => {
    if (!threadId) {
        return;
    }

    const lastMessage = getLastMessageOfThread(threadId);
    const extraParameters = lastMessage?.extraParameters;

    return extraParameters ?? undefined;
};
