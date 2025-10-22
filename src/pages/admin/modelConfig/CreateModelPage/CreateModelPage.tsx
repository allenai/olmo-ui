import { FormProvider, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import { useModelConfigValidationActionData } from '@/api/useModelConfigValidationActionData';
import { MetaTags } from '@/components/MetaTags';

import {
    ModelConfigForm,
    type ModelConfigFormValues,
} from '../components/ModelConfigForm/ModelConfigForm';
import { mapModelConfigFormValuesToRequest } from '../mapModelConfigFormValuesToRequest';
import { DEFAULT_CREATE_MODEL_VALUES } from './createModelConstants';

export const CreateModelPage = () => {
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: DEFAULT_CREATE_MODEL_VALUES,
        mode: 'onBlur',
    });

    const submit = useSubmit();
    useModelConfigValidationActionData(formContext.setError);

    const handleSubmit = (formData: ModelConfigFormValues) => {
        submit(mapModelConfigFormValuesToRequest(formData), {
            method: 'post',
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
