import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { Mutable } from '@/util';

import { ModelConfigFormValues } from './components/ModelConfigForm/ModelConfigForm';

export const mapModelConfigFormValuesToRequest = (
    formData: ModelConfigFormValues
): SchemaRootCreateModelConfigRequest => {
    const {
        availability,
        availableTime,
        deprecationTime,
        familyId,
        informationUrl,
        inferenceConstraints,
        ...rest
    } = formData;

    const internal = availability === 'internal';
    const mappedFamilyId = familyId === 'no_family' ? undefined : familyId;
    const mappedInformationUrl = informationUrl?.trim() === '' ? undefined : informationUrl;
    const request = {
        ...rest,
        temperatureDefault: inferenceConstraints.temperature.default,
        temperatureLower: inferenceConstraints.temperature.minValue,
        temperatureUpper: inferenceConstraints.temperature.maxValue,
        temperatureStep: inferenceConstraints.temperature.step,
        topPDefault: inferenceConstraints.topP.default,
        topPLower: inferenceConstraints.topP.minValue,
        topPUpper: inferenceConstraints.topP.maxValue,
        topPStep: inferenceConstraints.topP.step,
        maxTokensDefault: inferenceConstraints.maxTokens.default,
        maxTokensLower: inferenceConstraints.maxTokens.minValue,
        maxTokensUpper: inferenceConstraints.maxTokens.maxValue,
        maxTokensStep: inferenceConstraints.maxTokens.step,
        stopDefault: inferenceConstraints.stop,
        internal,
        familyId: mappedFamilyId,
        informationUrl: mappedInformationUrl,
        availableTime: availableTime?.toAbsoluteString(),
        deprecationTime: deprecationTime?.toAbsoluteString(),
    } as Mutable<SchemaRootCreateModelConfigRequest>;

    return request;
};
