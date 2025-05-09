import { parseAbsoluteToLocal } from '@internationalized/date';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useSubmit } from 'react-router-dom';

import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { MetaTags } from '@/components/MetaTags';
import { links } from '@/Links';

import { ModelConfigForm, type ModelConfigFormValues } from '../components/ModelConfigForm';
import { mapConfigFormDataToRequest } from '../mapConfigFormDataToRequest';
import { useAdminModelById } from '../useGetAdminModels';

const mapModelEditFormData = (model: SchemaResponseModel): ModelConfigFormValues => {
    const { availableTime, deprecationTime, internal, familyId, ...rest } = model;

    const modifiedAvailableTime = availableTime ? parseAbsoluteToLocal(availableTime) : undefined;

    const modifiedDeprecationTime = deprecationTime
        ? parseAbsoluteToLocal(deprecationTime)
        : undefined;

    return {
        ...rest,
        familyId: familyId ?? 'no_family',
        availableTime: modifiedAvailableTime,
        deprecationTime: modifiedDeprecationTime,
    };
};

export const UpdateModelPage = () => {
    const { modelId } = useParams();
    const { data, status } = useAdminModelById(modelId as string);
    const submit = useSubmit();
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: data
            ? mapModelEditFormData(data)
            : {
                  promptType: 'text_only',
                  host: 'modal',
                  availability: 'internal',
                  familyId: 'no_family',
                  modelType: 'chat',
              },
        mode: 'onChange',
    });

    if (!modelId) {
        return 'Model Id is missing';
    }

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    const handleSubmit = (formData: ModelConfigFormValues) => {
        const path = links.editModel(data.id);
        submit(mapConfigFormDataToRequest(formData), {
            method: 'put',
            action: path,
            encType: 'application/json',
        });
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
