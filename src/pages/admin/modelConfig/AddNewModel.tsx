import { FormProvider, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { MetaTags } from '@/components/MetaTags';

import { ModelConfigForm } from './components/ModelConfigForm';

export const AddNewModel = () => {
    const formContext = useForm<
        SchemaRootCreateModelConfigRequest & { availability: 'public' | 'internal' | 'prerelease' }
    >({
        defaultValues: {
            promptType: 'text_only',
        },
        mode: 'onChange',
    });

    const submit = useSubmit();
    return (
        <>
            <MetaTags />
            <FormProvider {...formContext}>
                <ModelConfigForm
                    onSubmit={(formData) => {
                        submit(formData, { method: 'post' });
                    }}
                />
            </FormProvider>
        </>
    );
};
