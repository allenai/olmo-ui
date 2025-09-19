import { css } from '@allenai/varnish-panda-runtime/css';
import { Input, Slider, SliderProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

interface ControlledSliderWithInputProps<T>
    extends Omit<SliderProps<T>, 'onChange' | 'name' | 'errorMessage'> {
    name: string;
    controllerProps?: Omit<UseControllerProps, 'name'>;
}

export const ControlledSliderWithInput = <T extends number | number[]>({
    name,
    controllerProps,
    ...rest
}: ControlledSliderWithInputProps<T>): ReactNode => {
    const {
        field: { ref, ...field },
        fieldState: { error },
    } = useController({ name, ...controllerProps });

    // NOTE: No number input component in varnish-ui
    // TODO: add NumberField input component to varnish-ui
    const handleInputChange = (value: string) => {
        field.onChange(Number(value));
    };

    return (
        <div
            className={css({
                display: 'flex',
                gap: '3',
            })}>
            <Slider
                outputClassName={css({
                    display: 'none',
                })}
                errorMessage={error?.message}
                {...field}
                {...rest}
            />
            <Input
                className={css({
                    justifySelf: 'flex-end',
                    width: '[75px]',
                    flex: '[0 0 75px]',
                })}
                {...field}
                onChange={handleInputChange}
            />
        </div>
    );
};
