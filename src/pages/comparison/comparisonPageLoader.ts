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
        const { resetSelectedThreadState, resetAttribution, getSchema, schema, abortPrompt } =
            appContext.getState();

        const promises = [];

        // abort the current streaming prompt if there is any
        abortPrompt();

        const models = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];

        if (schema == null) {
            promises.push(getSchema());
        }

        // (always true on this page at the moment)
        if (params.id === undefined) {
            resetSelectedThreadState();
            resetAttribution();
        }

        await Promise.all(promises);

        const threadListString = new URL(request.url).searchParams.get('threads');
        const threadListStrArray = threadListString?.split(',').map((m) => m.trim()) ?? [];

        const modelListString = new URL(request.url).searchParams.get('models');
        const modelListStrArray = modelListString?.split(',').map((m) => m.trim()) ?? [];

        console.log('DEBUG: comparisonPageLoader called', {
            threadListString,
            threadListStrArray,
            modelListString,
            modelListStrArray
        });

        // If no URL parameters provided, initialize with default models for comparison
        if (threadListStrArray.length === 0 && modelListStrArray.length === 0) {
            console.log('DEBUG: comparisonPageLoader - No URL params, using default models');
            const defaultModels = [
                {
                    threadViewId: '0',
                    model: models[0], 
                    rootThreadId: undefined,
                },
                {
                    threadViewId: '1',
                    model: models[0],
                    rootThreadId: undefined,
                },
            ];

            setSelectedCompareModels(defaultModels);
            return null;
        }

        console.log('DEBUG: comparisonPageLoader - Loading threads from URL params');

        const threadsAndModelPromises = arrayZip(threadListStrArray, modelListStrArray).map(
            async ([threadId, modelIdParam], idx) => {
                console.log(`DEBUG: comparisonPageLoader - Loading thread ${idx + 1}/${threadListStrArray.length}:`, { threadId, modelIdParam });
                
                let modelId: Model['id'] | undefined = modelIdParam;

                if (threadId) {
                    try {
                        const { messages } = await getThread(threadId);
                        console.log(`DEBUG: comparisonPageLoader - Thread ${threadId} loaded successfully`, { messageCount: messages.length });
                        
                        if (!modelIdParam) {
                            const lastResponse = messages.findLast(({ role }) => role === Role.LLM);
                            modelId = lastResponse?.modelId;
                            console.log(`DEBUG: comparisonPageLoader - Detected model from thread:`, { modelId });
                        }
                    } catch (error) {
                        console.log(`DEBUG: comparisonPageLoader - Failed to load thread ${threadId}:`, error);
                    }
                }

                const modelObj = modelId ? models.find(modelById(modelId)) : models[0];
                console.log(`DEBUG: comparisonPageLoader - Thread ${idx} result:`, { 
                    threadViewId: String(idx), 
                    modelName: modelObj?.name, 
                    rootThreadId: threadId 
                });

                return {
                    threadViewId: String(idx),
                    model: modelObj,
                    rootThreadId: threadId,
                };
            }
        );

        const threadsAndModels = await Promise.all(threadsAndModelPromises);

        console.log('DEBUG: comparisonPageLoader - Setting selectedCompareModels:', threadsAndModels);
        setSelectedCompareModels(threadsAndModels);

        return null;
    };
};
