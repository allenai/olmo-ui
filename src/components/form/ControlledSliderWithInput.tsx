import { css } from '@allenai/varnish-panda-runtime/css';
import { Slider, SliderProps } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';
import { useController, type UseControllerProps, useFormContext } from 'react-hook-form';

interface ControlledSliderWithInputProps<T>
    extends Omit<SliderProps<T>, 'onChange' | 'name' | 'errorMessage'> {
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

    const { setValue, watch } = useFormContext();

    const inputValue = watch(name) as T;
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setValue(name, newValue);
    };

    return (
        <fieldset
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
            <input
                aria-label={rest.label}
                type="number"
                min={rest.minValue}
                max={rest.maxValue}
                step={rest.step}
                className={css({
                    justifySelf: 'flex-end',
                    textAlign: 'right',
                    width: '[75px]',
                    flex: '[0 0 75px]',
                    '&:focus': {
                        '--outline-width': '1px',
                        outlineWidth: 'var(--outline-width)',
                        outlineStyle: 'solid',
                        outlineColor: 'accent.secondary',
                        borderRadius: 'md',
                        outlineOffset: '[calc(var(--outline-width) * -1)]',
                    },
                })}
                value={inputValue}
                onChange={handleInputChange}
            />
        </fieldset>
    );
};
