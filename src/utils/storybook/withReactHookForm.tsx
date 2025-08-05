import { FormProvider, useForm } from 'react-hook-form';
import type { DecoratorFunction } from 'storybook/internal/types';

export const withReactHookForm: DecoratorFunction = (Story) => {
    // Storybook decorators start with lower case letters, rules of hooks doesn't like that!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const formContext = useForm();

    return (
        <FormProvider {...formContext}>
            <Story />
        </FormProvider>
    );
};
