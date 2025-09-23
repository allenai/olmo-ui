import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

import { SliderWithInput, SliderWithInputProps } from './SliderWithInput';

interface ControlledSliderWithInputProps<T>
    extends Omit<SliderWithInputProps<T>, 'onChange' | 'name' | 'errorMessage'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledSliderWithInput = <T extends number>({
    name,
    controllerProps,
    ...rest
}: ControlledSliderWithInputProps<T>): ReactNode => {
    const {
        field: { ref, ...field },
        fieldState: { error },
    } = useController({ name, ...controllerProps });

    return <SliderWithInput errorMessage={error?.message} {...field} {...rest} />;
};
