import { parseAbsolute, parseAbsoluteToLocal } from '@internationalized/date';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useSubmit } from 'react-router-dom';

import type {
    SchemaResponseModel,
    SchemaRootCreateModelConfigRequest,
} from '@/api/playgroundApi/playgroundApiSchema';
import { MetaTags } from '@/components/MetaTags';
import { links } from '@/Links';
import type { Mutable } from '@/util';

import { ModelConfigForm, type ModelConfigFormValues } from '../components/ModelConfigForm';

const mapConfigFormDataToRequest = (
    formData: ModelConfigFormValues
): SchemaRootCreateModelConfigRequest => {
    const { availability, availableTime, deprecationTime, familyId, ...rest } = formData;

    const internal = availability === 'internal';
    const mappedFamilyId = familyId === 'no_family' ? undefined : familyId;
    const request = {
        ...rest,
        internal,
        familyId: mappedFamilyId,
        availableTime: availableTime?.toAbsoluteString(),
        deprecationTime: deprecationTime?.toAbsoluteString(),
    } as Mutable<SchemaRootCreateModelConfigRequest>;

    return request;
};

const mapModelEditFormData = (model: ModelConfigFormValues) => {
    const { availableTime, deprecationTime, internal } = model;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const modifiedAvailableTime = availableTime ? parseAbsoluteToLocal(availableTime.toString()) : undefined;

    const modifiedDeprecationTime = deprecationTime
        ? parseAbsoluteToLocal(deprecationTime.toString())
        : undefined;

    const availability: 'public' | 'internal' | 'prerelease' = internal
        ? 'internal'
        : modifiedAvailableTime || modifiedDeprecationTime
          ? 'prerelease'
          : 'public';

    return {
        ...model,
        availableTime: modifiedAvailableTime,
        deprecationTime: modifiedDeprecationTime,
        availability,
    };
};

export const CreateModelPage = () => {
    const location = useLocation();
    const model = location.state?.modelToEdit as ModelConfigFormValues;
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: model
            ? mapModelEditFormData(model)
            : {
                  promptType: 'text_only',
                  host: 'modal',
                  availability: 'internal',
                  familyId: 'no_family',
                  modelType: 'chat',
              },
        mode: 'onChange',
    });

    const isEditMode = !!model;

    const submit = useSubmit();

    const handleSubmit = (formData: ModelConfigFormValues) => {
        if (isEditMode) {
            const path = links.editModel(model.id);
            submit(mapConfigFormDataToRequest(formData), {
                method: 'put',
                action: path,
                encType: 'application/json',
            });
        } else {
            submit(mapConfigFormDataToRequest(formData), {
                method: 'post',
                encType: 'application/json',
            });
        }
    };
    return (
        <>
            <MetaTags />
            <FormProvider {...formContext}>
                <ModelConfigForm onSubmit={handleSubmit} />
            </FormProvider>
        </>
    );
};
