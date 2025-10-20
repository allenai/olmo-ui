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
import { CompareModelState } from '@/slices/CompareModelSlice';

import { parseComparisonSearchParams } from './parseComparisonSearchParams';

export interface ComparisonLoaderData {
    comparisonModels?: CompareModelState[];
    promptTemplateId?: string;
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
    return async ({ params: _params, request }): Promise<ComparisonLoaderData> => {
        const {
            resetSelectedThreadState,
            resetAttribution: _rstAtr,
            clearAllStreamErrors,
        } = appContext.getState();

        const visibleModels = (await queryClient.ensureQueryData(getModelsQueryOptions)).filter(
            isModelVisible
        );

        const searchParams = new URL(request.url).searchParams;
        // If no thread parameters provided in url search, initialize with default models for comparison
        if (searchParams.size === 0 || (searchParams.size === 1 && searchParams.has('template'))) {
            const comparisonModels = initializeDefaultComparisonModels(visibleModels);
            return {
                comparisonModels,
                promptTemplateId: searchParams.get('template') ?? undefined, // only apply to new threads
            };
        }

        const threadParamsList = parseComparisonSearchParams(searchParams);

        // TODO (bb): reset, but correctly
        // if (params.id === undefined) {
        //     resetAttribution();
        // }
        resetSelectedThreadState();

        // Clear stream errors only for fresh comparison (no threads in URL)
        if (threadParamsList.every((p) => !p.threadId)) {
            clearAllStreamErrors();
        }

        const threadsAndModelPromises = threadParamsList.map(async ({ threadId, modelId }, idx) => {
            let lastResponse: FlatMessage | undefined;

            if (threadId) {
                try {
                    const { messages } = await queryClient.ensureQueryData(threadOptions(threadId));
                    lastResponse = messages.findLast(({ role }) => role === Role.LLM);
                } catch (error) {
                    console.error(
                        `ComparisonPageLoader - Failed to load thread ${threadId}:`,
                        error
                    );
                }
            }

            const selectedModelId = selectModelIdForThread(visibleModels, lastResponse, modelId);

            const modelObj = selectedModelId
                ? visibleModels.find(modelById(selectedModelId))
                : visibleModels[0];

            const result = {
                threadViewId: String(idx),
                model: modelObj,
                rootThreadId: threadId,
            };

            return result;
        });

        const comparisonModels = await Promise.all(threadsAndModelPromises);

        // TODO (bb): attribition on load

        return { comparisonModels };
    };
};
