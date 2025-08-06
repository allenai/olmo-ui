import { Switch, type SwitchProps } from '@allenai/varnish-ui';
import { useObjectRef } from '@react-aria/utils';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

interface ControlledSwitchProps extends Omit<SwitchProps, 'onChange' | 'name' | 'errorMessage'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledSwitch = ({
    name,
    controllerProps,
    ...rest
}: ControlledSwitchProps): ReactNode => {
    const {
        field: { ref, ...field },
        fieldState: { error },
    } = useController({ name, ...controllerProps });

    const inputRef = useObjectRef(ref);

    return (
        <Switch
            errorMessage={error?.message}
            inputRef={inputRef}
            isSelected={field.value as boolean}
            {...field}
            {...rest}
        />
    );
};
