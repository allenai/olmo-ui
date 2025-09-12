import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { Mutable } from '@/util';

import { ModelConfigFormValues } from './components/ModelConfigForm/ModelConfigForm';

export const mapConfigFormDataToRequest = (
    formData: ModelConfigFormValues
): SchemaRootCreateModelConfigRequest => {
    const { availability, availableTime, deprecationTime, familyId, informationUrl, ...rest } =
        formData;

    const internal = availability === 'internal';
    const mappedFamilyId = familyId === 'no_family' ? undefined : familyId;
    const mappedInformationUrl = informationUrl?.trim() === '' ? undefined : informationUrl;
    const request = {
        ...rest,
        internal,
        familyId: mappedFamilyId,
        informationUrl: mappedInformationUrl,
        availableTime: availableTime?.toAbsoluteString(),
        deprecationTime: deprecationTime?.toAbsoluteString(),
    } as Mutable<SchemaRootCreateModelConfigRequest>;

    return request;
};
