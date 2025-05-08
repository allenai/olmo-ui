import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useSubmit } from 'react-router-dom';

import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { MetaTags } from '@/components/MetaTags';
import { links } from '@/Links';

import { ModelConfigForm } from './components/ModelConfigForm';

export const AddNewModel = () => {
    const location = useLocation();
    const model = location.state?.modelToEdit as SchemaRootCreateModelConfigRequest;
    const formContext = useForm<
        SchemaRootCreateModelConfigRequest & { availability: 'public' | 'internal' | 'prerelease' }
    >({
        defaultValues: {
            ...model,
            promptType: 'text_only',
        },
        mode: 'onChange',
    });

    const isEditMode = !!model;

    const submit = useSubmit();
    return (
        <>
            <MetaTags />
            <FormProvider {...formContext}>
                <ModelConfigForm
                    onSubmit={(formData) => {
                        if (isEditMode) {
                            const path = links.editModel(model.id);
                            const cleanedFormData = Object.fromEntries(
                                Object.entries(formData).filter(([_, v]) => v !== null)
                            );
                            console.log(cleanedFormData);
                            submit(cleanedFormData, { method: 'put', action: path });
                        } else {
                            submit(formData, { method: 'post' });
                        }
                    }}
                />
            </FormProvider>
        </>
    );
};
