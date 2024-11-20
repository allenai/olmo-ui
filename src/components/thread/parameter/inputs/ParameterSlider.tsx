/**
 * A slider with a number control next to it.
 */

import { Box, Input, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useAppContext } from '@/AppContext';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

interface Props {
    ariaLabel?: string;
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
    ariaLabel,
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
    const clipToMinMax = (val: number) => Math.min(Math.max(val, min), max);

    const [value, _setValue] = useState(clipToMinMax(initialValue));

    const setValue = (newValue: number) => {
        _setValue(clipToMinMax(newValue));
    };

    useEffect(() => {
        _setValue(initialValue);
    }, [initialValue]);

    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const handleChange = useDebouncedCallback((value: number) => {
        onChange?.(value);

        addSnackMessage({
            id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Parameters Saved',
        });
    }, 800);

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        const value = Array.isArray(newValue) ? newValue[0] : newValue;
        setValue(value);
        handleChange(value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setValue(value);
        handleChange(newValue);
    };

    return (
        <ParameterDrawerInputWrapper
            inputId={id}
            label={label}
            ariaLabel={ariaLabel}
            tooltipContent={dialogContent}
            tooltipTitle={dialogTitle}>
            {({ inputLabelId }) => (
                <>
                    <Box gridColumn={1}>
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
                    <Box gridColumn={2} justifySelf="right">
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
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
                            })}
                            inputProps={{
                                step,
                                min,
                                max,
                                type: 'number',
                                id,
                                sx: {
                                    textAlign: 'right',
                                    width: 'auto',
                                    height: '100%',
                                },
                            }}
                        />
                    </Box>
                </>
            )}
        </ParameterDrawerInputWrapper>
    );
};
