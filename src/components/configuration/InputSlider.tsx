/**
 * A slider with a number control next to it.
 */

import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { Box, Grid, Typography, Slider, Input as MuiInput, Stack } from '@mui/material';

import { ParameterTooltip } from '../ParameterTooltip';

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

export const InputSlider = ({
    min = 0,
    max = 100,
    step = 1,
    initialValue = 0,
    label,
    dialogContent,
    dialogTitle,
    onChange,
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
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" gap={1}>
                <Typography id="input-slider" gutterBottom>
                    {label}
                </Typography>
                {dialogContent && dialogTitle && (
                    <ParameterTooltip title={dialogTitle} content={dialogContent} />
                )}
            </Stack>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={value}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        step={step}
                        min={min}
                        max={max}
                    />
                </Grid>
                <Grid item>
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

const Input = styled(MuiInput)`
    width: 6ch;
`;
