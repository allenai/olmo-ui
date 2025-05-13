import { FormProvider, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import { usePydanticValidationActionData } from '@/api/usePydanticValidationActionData';
import { MetaTags } from '@/components/MetaTags';

import { ModelConfigForm, type ModelConfigFormValues } from '../components/ModelConfigForm';
import { mapConfigFormDataToRequest } from '../mapConfigFormDataToRequest';

export const CreateModelPage = () => {
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: {
            promptType: 'text_only',
            host: 'modal',
            availability: 'internal',
            familyId: 'no_family',
            modelType: 'chat',
        },
        mode: 'onBlur',
    });

    const submit = useSubmit();
    usePydanticValidationActionData(formContext.setError);

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
