import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useSubmit } from 'react-router';

import { useModelConfigValidationActionData } from '@/api/useModelConfigValidationActionData';
import { MetaTags } from '@/components/MetaTags';
import { links } from '@/Links';

import {
    ModelConfigForm,
    type ModelConfigFormValues,
} from '../components/ModelConfigForm/ModelConfigForm';
import { mapDataToModelConfigFormValues } from '../mapDataToModelConfigFormValues';
import { mapModelConfigFormValuesToRequest } from '../mapModelConfigFormValuesToRequest';
import { useAdminModelById } from '../useGetAdminModels';

export const UpdateModelPage = () => {
    const { modelId } = useParams();
    const { data, status } = useAdminModelById(modelId as string);
    const submit = useSubmit();
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: data
            ? mapDataToModelConfigFormValues(data)
            : {
                  promptType: 'text_only',
                  host: 'modal',
                  availability: 'internal',
                  familyId: 'no_family',
                  modelType: 'chat',
              },
        mode: 'onBlur',
    });

    useModelConfigValidationActionData(formContext.setError);

    if (!modelId) {
        return 'Model Id is missing';
    }

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    const handleSubmit = (formData: ModelConfigFormValues) => {
        const path = links.editModel(data.id);
        submit(mapModelConfigFormValuesToRequest(formData), {
            method: 'put',
            action: path,
            encType: 'application/json',
        });
    };

    return (
        <>
            <MetaTags />
            <FormProvider {...formContext}>
                <ModelConfigForm onSubmit={handleSubmit} disableIdField />
            </FormProvider>
        </>
    );
};
