import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

import { DatePicker, type DatePickerProps } from '../datepicker';

interface ControlledDatePickerProps
    extends Omit<DatePickerProps, 'onChange' | 'name' | 'errorMessage' | 'onBlur'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledDatePicker = ({
    name,
    controllerProps,
    ...rest
}: ControlledDatePickerProps): ReactNode => {
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
        <DatePicker
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
            isRequired={isRequired}
            {...field}
            {...rest}
        />
    );
};
