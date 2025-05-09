import { parseAbsoluteToLocal } from '@internationalized/date';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useSubmit } from 'react-router-dom';

import { MetaTags } from '@/components/MetaTags';
import { links } from '@/Links';

import { ModelConfigForm, type ModelConfigFormValues } from '../components/ModelConfigForm';
import { mapConfigFormDataToRequest } from '../mapConfigFormDataToRequest';

const mapModelEditFormData = (model: ModelConfigFormValues) => {
    const { availableTime, deprecationTime, internal } = model;

    const modifiedAvailableTime = availableTime
        ? parseAbsoluteToLocal(availableTime.toString())
        : undefined;

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

export const UpdateModelPage = () => {
    const location = useLocation();
    const model = location.state?.modelToEdit as ModelConfigFormValues;
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: mapModelEditFormData(model),
        mode: 'onChange',
    });

    const submit = useSubmit();

    const handleSubmit = (formData: ModelConfigFormValues) => {
        const path = links.editModel(model.id);
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
