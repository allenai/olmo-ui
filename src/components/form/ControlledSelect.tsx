import { Select, type SelectProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

interface ControlledSelectProps
    extends Omit<SelectProps, 'onSelectionChange' | 'name' | 'errorMessage' | 'onBlur'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledSelect = ({
    name,
    controllerProps,
    ...rest
}: ControlledSelectProps): ReactNode => {
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
        // @ts-expect-error - Select doesn't like being passed ...rest for some reason
        <Select
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
            isRequired={isRequired}
            onSelectionChange={field.onChange}
            selectedKey={field.value}
            {...field}
            {...rest}
        />
    );
};
