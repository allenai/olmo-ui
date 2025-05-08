import { FormProvider, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import type { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { MetaTags } from '@/components/MetaTags';
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
        availableTime: availableTime?.toString(),
        deprecationTime: deprecationTime?.toString(),
    } as Mutable<SchemaRootCreateModelConfigRequest>;

    return request;
};

export const CreateModelPage = () => {
    const formContext = useForm<ModelConfigFormValues>({
        defaultValues: {
            promptType: 'text_only',
            host: 'modal',
            availability: 'internal',
            familyId: 'no_family',
            modelType: 'chat',
        },
        mode: 'onChange',
    });

    const submit = useSubmit();

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
