/**
 * A slider with a number control next to it.
 */

import { Box, Input, Slider } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

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
    const addSnackMessageDebounce = useDebouncedCallback(() => {
        addSnackMessage({
            id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Parameters Saved',
        });
    }, 800);

    const handleChange = useCallback(
        (value: number) => {
            if (onChange != null) {
                onChange(value);
            }

            addSnackMessageDebounce();
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
                <Box display="grid" gridTemplateColumns="auto min-content" columnGap={1}>
                    <Box>
                        <Slider
                            value={value}
                            onChange={handleSliderChange}
                            aria-labelledby={inputLabelId}
                            step={step}
                            min={min}
                            max={max}
                            sx={{
                                color: 'inherit',
                            }}
                        />
                    </Box>
                    <Box>
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            sx={(theme) => ({
                                ...theme.typography.caption,
                                border: 'none',
                                '&:before': {
                                    borderBottom: 'none', // Remove underline (focused and unfocused)
                                },
                                '&:after': {
                                    borderBottom: 'none', // Remove focused underline
                                },
                                '&:hover:not(.Mui-disabled):before': {
                                    borderBottom: 'none', // Remove hover underline
                                },
                                color: (theme) => theme.palette.text.primary,
                                mr: theme.spacing(-1),
                            })}
                            inputProps={{
                                step,
                                min,
                                max,
                                type: 'number',
                                id,
                                sx: { textAlign: 'right', width: 'auto' },
                            }}
                        />
                    </Box>
                </Box>
            )}
        </ParameterDrawerInputWrapper>
    );
};
