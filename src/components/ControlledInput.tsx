import { Input, type InputProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

interface ControlledInputProps extends Omit<InputProps, 'onChange' | 'name'> {
    name: string;
    controllerProps: Omit<UseControllerProps, 'name'>;
}

export const ControlledInput = ({
    name,
    controllerProps,
    ...rest
}: ControlledInputProps): ReactNode => {
    const {
        field,
        fieldState: { error, invalid },
    } = useController({ name, ...controllerProps });

    const isRequired =
        controllerProps.rules?.required === true ||
        (typeof controllerProps.rules?.required === 'object' &&
            controllerProps.rules.required.value) ||
        !!controllerProps.rules?.required;

    return (
        <Input
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
            isRequired={isRequired}
            {...field}
            {...rest}
        />
    );
};
