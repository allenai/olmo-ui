import { Model } from '@/api/playgroundApi/additionalTypes';
import type {
    SchemaPromptTemplateResponse,
    SchemaToolDefinition,
} from '@/api/playgroundApi/playgroundApiSchema';
import { SchemaCreateMessageRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { type FlatMessage, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import { areModelsCompatibleForThread } from '@/components/thread/ModelSelect/useModels';
import { clipToMinMax } from '@/utils/clipToMinMax';

import type { ExtraParameters } from './QueryContext';
import { StreamingThread } from './stream-types';

// TODO: we can probably remove these defaults once we have per-thread settings in comparison mode
const DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON = {
    temperature: 0.7,
    topP: 1,
    maxTokens: 2048,
    n: 1,
    logprobs: undefined,
    stop: undefined,
};

export const getThread = (threadId: string | undefined): StreamingThread | undefined => {
    if (!threadId) return;
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

export const shouldShowCompatibilityWarning = (
    currentModel: Model | undefined,
    newModel: Model,
    hasActiveThread: boolean
): boolean => {
    return Boolean(
        hasActiveThread && currentModel && !areModelsCompatibleForThread(currentModel, newModel)
    );
};

export const hasUserTools = (toolJson: string | undefined) => {
    if (!toolJson) {
        return false;
    }
    try {
        const parsed = JSON.parse(toolJson);

        if (!Array.isArray(parsed)) {
            return false;
        }

        return parsed.length > 0;
    } catch {
        return false;
    }
};

export function areAllModelsCompatible(models: readonly Model[]): boolean {
    if (models.length < 2) return true;

    for (let i = 0; i < models.length; i++) {
        for (let j = i + 1; j < models.length; j++) {
            if (!areModelsCompatibleForThread(models[i], models[j])) {
                return false;
            }
        }
    }
    return true;
}

export type MessageInferenceParameters = Pick<
    SchemaCreateMessageRequest,
    'temperature' | 'topP' | 'maxTokens' | 'n' | 'logprobs' | 'stop'
>;

export const getInitialInferenceParameters = (
    model?: Model,
    thread?: StreamingThread,
    promptTemplate?: SchemaPromptTemplateResponse
): MessageInferenceParameters => {
    const constraints = getInferenceConstraints(model);
    const lastLLMMessage = thread?.messages.filter((msg) => msg.role === Role.LLM).at(-1);
    const inferenceParams: MessageInferenceParameters = {
        temperature: clipToMinMax(
            lastLLMMessage?.opts.temperature ??
                promptTemplate?.opts.temperature ??
                model?.temperature_default ??
                DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON.temperature,
            constraints.temperature.minValue,
            constraints.temperature.maxValue
        ),
        topP: clipToMinMax(
            lastLLMMessage?.opts.topP ??
                promptTemplate?.opts.topP ??
                model?.top_p_default ??
                DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON.topP,
            constraints.topP.minValue,
            constraints.topP.maxValue
        ),
        maxTokens: clipToMinMax(
            lastLLMMessage?.opts.maxTokens ??
                promptTemplate?.opts.maxTokens ??
                model?.max_tokens_default ??
                DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON.maxTokens,
            constraints.maxTokens.minValue,
            constraints.maxTokens.maxValue
        ),
        n:
            lastLLMMessage?.opts.n ??
            promptTemplate?.opts.n ??
            DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON.n,
        logprobs:
            lastLLMMessage?.opts.logprobs ??
            promptTemplate?.opts.logprobs ??
            DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON.logprobs,
        stop:
            lastLLMMessage?.opts.stop ??
            promptTemplate?.opts.stop ??
            DEFAULT_INFERENCE_OPTS_FOR_MODEL_COMPARISON.stop,
    };

    return inferenceParams;
};

export type ModelInferenceConstraints = {
    temperature: {
        minValue: number;
        maxValue: number;
        step: number;
    };
    topP: {
        minValue: number;
        maxValue: number;
        step: number;
    };
    maxTokens: {
        minValue: number;
        maxValue: number;
        step: number;
    };
};

/**
 * Get inference constraints for a specific model
 * @param model - If undefined, returns general constraints as fallback
 * @returns Inference constraints with min, max, and step values
 */
export const getInferenceConstraints = (model?: Model): ModelInferenceConstraints => {
    return {
        temperature: {
            minValue: model?.temperature_lower ?? 0,
            maxValue: model?.temperature_upper ?? 1,
            step: model?.temperature_step ?? 0.01,
        },
        topP: {
            minValue: model?.top_p_lower ?? 0,
            maxValue: model?.top_p_upper ?? 1,
            step: model?.top_p_step ?? 0.01,
        },
        maxTokens: {
            minValue: model?.max_tokens_lower ?? 1,
            maxValue: model?.max_tokens_upper ?? 2048,
            step: model?.max_tokens_step ?? 1,
        },
    };
};
