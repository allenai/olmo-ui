import { RadioGroup, type RadioGroupProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

interface ControlledRadioGroupProps
    extends Omit<RadioGroupProps, 'onChange' | 'name' | 'errorMessage' | 'onBlur'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledRadioGroup = ({
    name,
    controllerProps,
    ...rest
}: ControlledRadioGroupProps): ReactNode => {
    const {
        field,
        fieldState: { error, invalid },
    } = useController({ name, ...controllerProps });

    const isRequired =
        controllerProps?.rules?.required === true ||
        (typeof controllerProps?.rules?.required === 'object' &&
            controllerProps.rules.required.value) ||
        !!controllerProps?.rules?.required;

    return (
        <RadioGroup
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
            isRequired={isRequired}
            {...field}
            {...rest}
        />
    );
};
