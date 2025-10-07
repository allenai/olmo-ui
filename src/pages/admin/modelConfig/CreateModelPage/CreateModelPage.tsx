import { FormProvider, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router';

import { useModelConfigValidationActionData } from '@/api/useModelConfigValidationActionData';
import { MetaTags } from '@/components/MetaTags';

import {
    ModelConfigForm,
    type ModelConfigFormValues,
} from '../components/ModelConfigForm/ModelConfigForm';
import { mapModelConfigFormValuesToRequest } from '../mapModelConfigFormValuesToRequest';

export const CreateModelPage = () => {
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: {
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
        },
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
