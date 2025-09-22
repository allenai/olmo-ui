import { FormProvider, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import { useModelConfigValidationActionData } from '@/api/useModelConfigValidationActionData';
import { MetaTags } from '@/components/MetaTags';

import {
    ModelConfigForm,
    type ModelConfigFormValues,
} from '../components/ModelConfigForm/ModelConfigForm';
import { mapConfigFormDataToRequest } from '../mapConfigFormDataToRequest';

export const CreateModelPage = () => {
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: {
            promptType: 'text_only',
            host: 'modal',
            availability: 'internal',
            familyId: 'no_family',
            modelType: 'chat',
            requireFileToPrompt: 'no_requirement',
            temperatureDefault: 0.7,
            temperatureUpper: 1,
            temperatureLower: 0,
            temperatureStep: 0.01,
            topPDefault: 1,
            topPUpper: 1,
            topPLower: 0.01,
            topPStep: 0.01,
            maxTokensDefault: 1024,
            maxTokensUpper: 2048,
            maxTokensLower: 1,
            maxTokensStep: 1,
        },
        mode: 'onBlur',
    });

    const submit = useSubmit();
    useModelConfigValidationActionData(formContext.setError);

    const handleSubmit = (formData: ModelConfigFormValues) => {
        submit(mapConfigFormDataToRequest(formData), {
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
