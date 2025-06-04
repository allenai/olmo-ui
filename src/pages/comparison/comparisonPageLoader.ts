import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { getThread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import { getModelsQueryOptions, modelById } from '@/components/thread/ModelSelect/useModels';
import { arrayZip } from '@/utils/arrayZip';

export const comparisonPageLoader = (queryClient: QueryClient): LoaderFunction => {
    return async ({ params, request }) => {
        const isComparisonPageEnabled = process.env.IS_COMPARISON_PAGE_ENABLED === 'true';
        const { setSelectedCompareModels } = appContext.getState();

        if (!isComparisonPageEnabled) {
            // React-router recommends throwing a response
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response('Not Found', { status: 404 });
        }

        // from playgroundLoader.ts
        const { resetAttribution, getSchema, schema, abortPrompt } = appContext.getState();

        const promises = [];

        // abort the current streaming prompt if there is any
        abortPrompt();

        const models = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];

        if (schema == null) {
            promises.push(getSchema());
        }

        // (always true on this page at the moment)
        if (params.id === undefined) {
            resetAttribution();
        }

        await Promise.all(promises);

        const threadListString = new URL(request.url).searchParams.get('threads');
        const threadListStrArray = threadListString?.split(',').map((m) => m.trim()) ?? [];

        const modelListString = new URL(request.url).searchParams.get('models');
        const modelListStrArray = modelListString?.split(',').map((m) => m.trim()) ?? [];

        const threadsAndModelPromises = arrayZip(threadListStrArray, modelListStrArray).map(
            async ([threadId, modelIdParam], idx) => {
                const { messages } = await getThread(threadId);
                let modelId: Model['id'] | undefined = modelIdParam;

                if (!modelIdParam) {
                    const lastResponse = messages.findLast(({ role }) => role === Role.LLM);
                    modelId = lastResponse?.modelId;
                }

                const modelObj = modelId ? models.find(modelById(modelId)) : models[0];

                return {
                    threadViewId: String(idx),
                    model: modelObj,
                    rootThreadId: threadId,
                };
            }
        );

        const threadsAndModels = await Promise.all(threadsAndModelPromises);

        setSelectedCompareModels(threadsAndModels);

        return null;
    };
};
