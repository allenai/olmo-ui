import { type TextAreaProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

import { FullWidthTextArea } from './FullWidthTextArea';

export interface ControlledTextAreaProps
    extends Omit<TextAreaProps, 'onChange' | 'name' | 'errorMessage' | 'onBlur'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledTextArea = ({
    name,
    controllerProps,
    ...rest
}: ControlledTextAreaProps): ReactNode => {
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
        <FullWidthTextArea
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
            isRequired={isRequired}
            {...field}
            {...rest}
        />
    );
};
