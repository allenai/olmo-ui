import { css } from '@allenai/varnish-panda-runtime/css';
import { Slider, SliderProps } from '@allenai/varnish-ui';
import { type ReactNode } from 'react';

import { clipToMinMax } from '@/utils/clipToMinMax';

export interface SliderWithInputProps<T> extends Omit<SliderProps<T>, 'outputClassName'> {
    inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'min' | 'max' | 'step'>;
    name?: string;
}

export const SliderWithInput = <T extends number>({
    inputProps,
    ...rest
}: SliderWithInputProps<T>): ReactNode => {
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
                {...rest}
            />
            {/* TODO: Add NumberField input to varnish-ui and replace here */}
            <input
                name={rest.name}
                aria-label={rest.label}
                type="number"
                value={rest.value}
                onChange={(e) => {
                    const { value, min, max } = e.target;
                    const valueNum = Number(value);
                    if (isNaN(valueNum)) {
                        return;
                    }

                    rest.onChange?.(clipToMinMax(valueNum, Number(min), Number(max)) as T);
                }}
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
                {...inputProps}
            />
        </fieldset>
    );
};
