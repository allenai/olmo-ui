/**
 * A slider with a number control next to it.
 */

import { Grid, Input, Slider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

interface Props {
    label: string;
    step?: number;
    min?: number;
    max?: number;
    initialValue?: number;
    dialogContent: string;
    dialogTitle: string;
    onChange?: (value: number) => void;
    id: string;
}

export const NewInputSlider = ({
    min = 0,
    max = 100,
    step = 1,
    initialValue = 0,
    label,
    dialogContent,
    dialogTitle,
    onChange,
    id,
}: Props) => {
    const clipToMinMax = (val: number) => {
        return Math.min(Math.max(val, min), max);
    };
    const [value, setValue] = useState<number>(clipToMinMax(initialValue));

    const firstUpdate = useRef(true);
    useEffect(() => {
        // Don't trigger onChange() on initial render.
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        onChange && onChange(value);
    }, [value]);

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        // this component will only have 1 value
        // if we add a second, we should rework this
        setValue(Array.isArray(newValue) ? newValue[0] : newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value));
    };

    const handleBlur = () => {
        const clippedValue = clipToMinMax(value);
        if (value !== clippedValue) {
            setValue(clippedValue);
        }
    };

    return (
        <ParameterDrawerInputWrapper
            inputId={id}
            label={label}
            tooltipContent={dialogContent}
            tooltipTitle={dialogTitle}>
            {({ inputLabelId }) => (
                <Grid container spacing={4}>
                    <Grid item xs={8}>
                        <Slider
                            value={value}
                            onChange={handleSliderChange}
                            aria-labelledby={inputLabelId}
                            step={step}
                            min={min}
                            max={max}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step,
                                min,
                                max,
                                type: 'number',
                                id,
                            }}
                        />
                    </Grid>
                </Grid>
            )}
        </ParameterDrawerInputWrapper>
    );
};
