import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';

import { StreamingThread } from './stream-types';

export function getThread(threadId: string): StreamingThread | undefined {
    const { queryKey } = threadOptions(threadId);
    return queryClient.getQueryData(queryKey);
}

export const getNonUserToolsFromThread = (threadId: string | undefined) => {
    if (!threadId) {
        return [];
    }
    const toolDefs = getThread(threadId)?.messages.at(-1)?.toolDefinitions || [];
    const userToolDefs = toolDefs.filter((def) => def.toolSource !== 'user_defined');
    return userToolDefs;
};

export const getUserToolDefinitionsFromThread = (threadId: string | undefined) => {
    if (!threadId) {
        return;
    }

    const toolDefs = getThread(threadId)?.messages.at(-1)?.toolDefinitions || null;
    const userToolDefs = toolDefs
        ?.filter((def) => def.toolSource === 'user_defined')
        .map(({ toolSource, ...def }) => def); // Remove toolSource property

    return userToolDefs ? JSON.stringify(userToolDefs, null, 2) : undefined;
};
