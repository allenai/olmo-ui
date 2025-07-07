import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import { getModelsQueryOptions, modelById } from '@/components/thread/ModelSelect/useModels';
import { CompareModelState } from '@/slices/CompareModelSlice';
import { arrayZip } from '@/utils/arrayZip';

export interface ComparisonLoaderData {
    comparisonModels?: CompareModelState[];
}

// Initialize default comparison models when no URL parameters are provided
const initializeDefaultComparisonModels = (
    models: Model[],
    count: number = 2
): CompareModelState[] => {
    return Array.from({ length: count }, (_, index) => ({
        threadViewId: String(index),
        model: models[0],
        rootThreadId: undefined,
    }));
};

export const comparisonPageLoader = (queryClient: QueryClient): LoaderFunction => {
    return async ({ params: _params, request }) => {
        const isComparisonPageEnabled = process.env.IS_COMPARISON_PAGE_ENABLED === 'true';

        if (!isComparisonPageEnabled) {
            // React-router recommends throwing a response
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response('Not Found', { status: 404 });
        }

        // from playgroundLoader.ts
        const {
            resetSelectedThreadState,
            resetAttribution: _rstAtr,
            getSchema,
            schema,
            abortPrompt,
        } = appContext.getState();

        const promises = [];

        // abort the current streaming prompt if there is any
        abortPrompt();

        const models = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];

        if (schema == null) {
            promises.push(getSchema());
        }

        // TODO (bb): reset, but correctly
        // if (params.id === undefined) {
        //     resetAttribution();
        // }
        resetSelectedThreadState();

        await Promise.all(promises);

        const threadListString = new URL(request.url).searchParams.get('threads');
        const threadListStrArray = threadListString?.split(',').map((m) => m.trim()) ?? [];

        const modelListString = new URL(request.url).searchParams.get('models');
        const modelListStrArray = modelListString?.split(',').map((m) => m.trim()) ?? [];

        // If no URL parameters provided, initialize with default models for comparison
        if (threadListStrArray.length === 0 && modelListStrArray.length === 0) {
            const comparisonModels = initializeDefaultComparisonModels(models);
            return { comparisonModels } as ComparisonLoaderData;
        }

        const threadsAndModelPromises = arrayZip(threadListStrArray, modelListStrArray).map(
            async ([threadId, modelIdParam], idx) => {
                let modelId: Model['id'] | undefined = modelIdParam;

                if (threadId) {
                    try {
                        const { messages } = await queryClient.ensureQueryData(
                            threadOptions(threadId)
                        );

                        if (!modelIdParam) {
                            const lastResponse = messages.findLast(({ role }) => role === Role.LLM);
                            modelId = lastResponse?.modelId;
                        }
                    } catch (error) {
                        console.log(
                            `ComparisonPageLoader - Failed to load thread ${threadId}:`,
                            error
                        );
                    }
                }

                const modelObj = modelId ? models.find(modelById(modelId)) : models[0];

                return {
                    threadViewId: String(idx),
                    model: modelObj,
                    rootThreadId: threadId,
                };
            }
        );

        const comparisonModels = await Promise.all(threadsAndModelPromises);

        // TODO (bb): attribition on load

        return { comparisonModels } as ComparisonLoaderData;
    };
};
