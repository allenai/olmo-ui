/**
 * A slider with a number control next to it.
 */

import { Box, Grid, Input, Slider, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { ParameterInfoButton } from './ParameterInfoButton';

interface Props {
    label: string;
    step?: number;
    min?: number;
    max?: number;
    initialValue?: number;
    dialogContent?: string;
    dialogTitle?: string;
    onChange?: (value: number) => void;
}

export const NewInputSlider = ({
    min = 0,
    max = 100,
    step = 1,
    initialValue = 0,
    label,
    dialogContent = '',
    dialogTitle = '',
    onChange,
}: Props) => {
    const clipToMinMax = (val: number) => {
        return Math.min(Math.max(val, min), max);
    };
    const boxRef = useRef<HTMLElement>();
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
        <Box sx={{ width: '100%' }} ref={boxRef}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} display="flex" flexDirection="row" alignItems="center" gap={1}>
                    <Typography id="input-slider" gutterBottom>
                        {label}
                    </Typography>
                    <ParameterInfoButton
                        anchorElement={boxRef.current}
                        tooltipTitle={dialogTitle}
                        tooltipContent={dialogContent}
                        tooltipId="slider"
                    />
                </Grid>
                <Grid item xs={8}>
                    <Slider
                        value={value}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
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
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
