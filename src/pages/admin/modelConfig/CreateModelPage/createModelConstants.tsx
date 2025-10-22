import type { ModelConfigFormValues } from '../components/ModelConfigForm/ModelConfigForm';

export const DEFAULT_CREATE_MODEL_VALUES = {
    promptType: 'text_only',
    host: 'modal',
    availability: 'internal',
    familyId: 'no_family',
    modelType: 'chat',
    requireFileToPrompt: 'no_requirement',
    inferenceConstraints: {
        temperature: {
            default: 0.7,
            minValue: 0,
            maxValue: 1,
            step: 0.01,
        },
        topP: {
            default: 1,
            minValue: 0.01,
            maxValue: 1,
            step: 0.01,
        },
        maxTokens: {
            default: 2024,
            minValue: 1,
            maxValue: 2048,
            step: 1,
        },
    },
} as const satisfies ModelConfigFormValues;
