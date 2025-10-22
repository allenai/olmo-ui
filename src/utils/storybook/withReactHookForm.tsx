import { DevTool } from '@hookform/devtools';
import { type DefaultValues, FormProvider, useForm } from 'react-hook-form';
import type { DecoratorFunction } from 'storybook/internal/types';

export const withReactHookForm = <T,>(defaultValues?: DefaultValues<T>): DecoratorFunction =>
    function ReactHookFormDecorator(Story) {
        const formContext = useForm({ defaultValues });

        return (
            <FormProvider {...formContext}>
                <Story />
                <DevTool control={formContext.control} />
            </FormProvider>
        );
    };
