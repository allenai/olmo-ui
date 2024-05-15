/**
 * A slider with a number control next to it.
 */

import { Box, Input, Slider, Stack } from '@mui/material';
import { neNP } from '@mui/material/locale';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppContext } from '@/AppContext';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

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

export const ParameterSlider = ({
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
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const handleChange = useCallback(
        (value: number) => {
            if (onChange != null) {
                onChange(value);
            }

            addSnackMessage({
                id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
                type: SnackMessageType.Brief,
                message: 'Parameters Saved',
            });
        },
        [onChange, addSnackMessage]
    );

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        // this component will only have 1 value
        // if we add a second, we should rework this
        const value = Array.isArray(newValue) ? newValue[0] : newValue;

        setValue(value);
        handleChange(value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setValue(value);
        handleChange(value);
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
                // The result of this ends up being pretty similar to MUI's Grid component
                // I had trouble getting Grid to add a column gap so I used flex stuff instead
                <Stack gap={3} flexWrap="wrap" direction="row">
                    <Box flexGrow={2} flexShrink={1} flexBasis="12rem">
                        <Slider
                            value={value}
                            onChange={handleSliderChange}
                            aria-labelledby={inputLabelId}
                            step={step}
                            min={min}
                            max={max}
                        />
                    </Box>
                    {/* The basis here accounts for roughly three characters and a decimal point at the minimum width. 
                    If we make a slider that needs more we'll need to change this basis or make it configurable */}
                    <Box flexGrow={1} flexShrink={1} flexBasis="calc(4ch + 1rem)">
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
                    </Box>
                </Stack>
            )}
        </ParameterDrawerInputWrapper>
    );
};
