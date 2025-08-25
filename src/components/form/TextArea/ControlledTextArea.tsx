import { type TextAreaProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { FieldPath, FieldValues, useController, type UseControllerProps } from 'react-hook-form';

import { FullWidthTextArea } from './FullWidthTextArea';

export interface ControlledTextAreaProps<TFieldValues extends FieldValues>
    extends Omit<TextAreaProps, 'onChange' | 'name' | 'errorMessage' | 'onBlur'> {
    name: FieldPath<TFieldValues>;
    controllerProps?: Omit<UseControllerProps<TFieldValues>, 'name'>;
}

export function ControlledTextArea<TFieldValues extends FieldValues>({
    name,
    controllerProps,
    ...rest
}: ControlledTextAreaProps<TFieldValues>): ReactNode {
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
}
