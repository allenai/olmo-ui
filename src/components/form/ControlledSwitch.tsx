import { Switch, type SwitchProps } from '@allenai/varnish-ui';
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
    return (
        <Switch
            errorMessage={error?.message}
            // @ts-expect-error - The types here are both refs but they don't agree with each other
            inputRef={ref}
            isSelected={field.value}
            {...field}
            {...rest}
        />
    );
};
