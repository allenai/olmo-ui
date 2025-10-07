import { parseAbsoluteToLocal } from '@internationalized/date';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigFormValues } from './components/ModelConfigForm/ModelConfigForm';

export const mapDataToModelConfigFormValues = (
    model: SchemaResponseModel
): ModelConfigFormValues => {
    const {
        availableTime,
        deprecationTime,
        internal,
        familyId,
        temperatureDefault,
        temperatureLower,
        temperatureUpper,
        temperatureStep,
        topPDefault,
        topPLower,
        topPUpper,
        topPStep,
        maxTokensDefault,
        maxTokensLower,
        maxTokensUpper,
        maxTokensStep,
        stopDefault,
        ...rest
    } = model;

    const modifiedAvailableTime = availableTime ? parseAbsoluteToLocal(availableTime) : undefined;

    const modifiedDeprecationTime = deprecationTime
        ? parseAbsoluteToLocal(deprecationTime)
        : undefined;

    const inferenceConstraints = {
        temperature: {
            default: temperatureDefault,
            minValue: temperatureLower,
            maxValue: temperatureUpper,
            step: temperatureStep,
        },
        topP: {
            default: topPDefault,
            minValue: topPLower,
            maxValue: topPUpper,
            step: topPStep,
        },
        maxTokens: {
            default: maxTokensDefault,
            minValue: maxTokensLower,
            maxValue: maxTokensUpper,
            step: maxTokensStep,
        },
        stop: stopDefault ?? undefined,
    };

    return {
        ...rest,
        familyId: familyId ?? 'no_family',
        availableTime: modifiedAvailableTime,
        deprecationTime: modifiedDeprecationTime,
        inferenceConstraints,
    };
};
