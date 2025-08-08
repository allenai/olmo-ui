import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { type FlatMessage, threadOptions } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import {
    areModelsCompatibleForThread,
    getModelsQueryOptions,
    isModelVisible,
    modelById,
} from '@/components/thread/ModelSelect/useModels';
import { selectModelIdForThread } from '@/contexts/modelSelectionUtils';
import { getFeatureToggles } from '@/FeatureToggleContext';
import { arrayZip } from '@/utils/arrayZip';

// Based on old slice state
export interface CompareModelState {
    threadViewId: string;
    rootThreadId?: string;
    model?: Model;
}

export interface ComparisonLoaderData {
    comparisonModels?: CompareModelState[];
}

// Initialize default comparison models when no URL parameters are provided
const initializeDefaultComparisonModels = (
    models: Model[],
    count: number = 2
): CompareModelState[] => {
    const results: CompareModelState[] = [];

    for (let index = 0; index < count; index++) {
        if (index === 0) {
            // First model: use regular selection logic
            const selectedModelId = selectModelIdForThread(models);
            const selectedModel = selectedModelId
                ? models.find(modelById(selectedModelId))
                : models[0];

            results.push({
                threadViewId: String(index),
                model: selectedModel,
                rootThreadId: undefined,
            });
        } else {
            // Subsequent models: only consider ones compatible with the first model
            const firstModel = results[0].model;
            if (!firstModel) {
                // Fallback if first model selection failed
                results.push({
                    threadViewId: String(index),
                    model: models[0],
                    rootThreadId: undefined,
                });
                continue;
            }

            // Filter for compatible models, excluding the first model to avoid duplicates
            const compatibleModels = models.filter(
                (model) =>
                    areModelsCompatibleForThread(firstModel, model) && model.id !== firstModel.id
            );

            // Cycle through compatible models, or use first model if no other compatible models
            const compatibleIndex = (index - 1) % Math.max(compatibleModels.length, 1);
            const selectedModel =
                compatibleModels.length > 0 ? compatibleModels[compatibleIndex] : firstModel;

            results.push({
                threadViewId: String(index),
                model: selectedModel,
                rootThreadId: undefined,
            });
        }
    }

    return results;
};

export const comparisonPageLoader = (queryClient: QueryClient): LoaderFunction => {
    return async ({ params: _params, request }) => {
        const { isComparisonPageEnabled } = getFeatureToggles();

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
            clearAllStreamErrors,
        } = appContext.getState();

        const promises = [];

        const allModels = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];
        // Filter models to match ComparisonProvider behavior
        const models = allModels.filter(isModelVisible);

        if (schema == null) {
            promises.push(getSchema());
        }

        // TODO (bb): reset, but correctly
        // if (params.id === undefined) {
        //     resetAttribution();
        // }
        resetSelectedThreadState();

        await Promise.all(promises);

        const searchParams = new URL(request.url).searchParams;
        const threadListString = searchParams.get('threads');
        const threadListStrArray = threadListString?.split(',').map((m) => m.trim()) ?? [];

        // Clear stream errors only for fresh comparison (no threads in URL)
        if (threadListStrArray.length === 0) {
            clearAllStreamErrors();
        }

        const modelListString = searchParams.get('models');
        const modelListStrArray = modelListString?.split(',').map((m) => m.trim()) ?? [];

        // If no URL parameters provided, initialize with default models for comparison
        if (threadListStrArray.length === 0 && modelListStrArray.length === 0) {
            const comparisonModels = initializeDefaultComparisonModels(models);
            return { comparisonModels } as ComparisonLoaderData;
        }

        const threadsAndModelPromises = arrayZip(threadListStrArray, modelListStrArray).map(
            async ([threadId, modelIdParam], idx) => {
                let lastResponse: FlatMessage | undefined;

                if (threadId) {
                    try {
                        const { messages } = await queryClient.ensureQueryData(
                            threadOptions(threadId)
                        );
                        lastResponse = messages.findLast(({ role }) => role === Role.LLM);
                    } catch (error) {
                        console.log(
                            `ComparisonPageLoader - Failed to load thread ${threadId}:`,
                            error
                        );
                    }
                }

                const selectedModelId = selectModelIdForThread(models, lastResponse, modelIdParam);

                const modelObj = selectedModelId
                    ? models.find(modelById(selectedModelId))
                    : models[0];

                const result = {
                    threadViewId: String(idx),
                    model: modelObj,
                    rootThreadId: threadId,
                };

                return result;
            }
        );

        const comparisonModels = await Promise.all(threadsAndModelPromises);

        // TODO (bb): attribition on load

        return { comparisonModels } as ComparisonLoaderData;
    };
};
