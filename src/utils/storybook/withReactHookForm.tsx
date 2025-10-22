import { DevTool } from '@hookform/devtools';
import { type DefaultValues, FormProvider, useForm } from 'react-hook-form';
import type { DecoratorFunction } from 'storybook/internal/types';

// TODO: allow passing form states into this decorator
export const withReactHookForm =
    <T,>(defaultValues?: DefaultValues<T>): DecoratorFunction =>
    // eslint-disable-next-line react/display-name
    (Story) => {
        // Storybook decorators start with lower case letters, rules of hooks doesn't like that!
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const formContext = useForm({ defaultValues });

        return (
            <FormProvider {...formContext}>
                <Story />
                <DevTool control={formContext.control} />
            </FormProvider>
        );
    };
