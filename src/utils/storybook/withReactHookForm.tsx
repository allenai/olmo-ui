import { DevTool } from '@hookform/devtools';
import { type DefaultValues, FormProvider, useForm } from 'react-hook-form';
import type { DecoratorFunction } from 'storybook/internal/types';

function ReactHookFormDecorator<T>({
    Story,
    defaultValues,
}: {
    Story: React.ComponentType;
    defaultValues?: DefaultValues<T>;
}) {
    const formContext = useForm({ defaultValues });

    return (
        <FormProvider {...formContext}>
            <Story />
            <DevTool control={formContext.control} />
        </FormProvider>
    );
}

export const withReactHookForm =
    <T,>(defaultValues?: DefaultValues<T>): DecoratorFunction =>
    (Story) => <ReactHookFormDecorator Story={Story} defaultValues={defaultValues} />;
