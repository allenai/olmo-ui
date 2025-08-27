/**
 * A slider with a number control next to it.
 */

import { stack } from '@allenai/varnish-panda-runtime/patterns';
import { Button, Switch } from '@allenai/varnish-ui';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useAppContext } from '@/AppContext';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

interface Props {
    label: string;
    initialValue?: boolean;
    dialogContent: string;
    dialogTitle: string;
    disableEditButton?: boolean;
    disableToggle?: boolean;
    onEditClick?: () => void;
    onChange?: (value: boolean) => void;
    id: string;
}

export const ParameterToggle = ({
    label,
    initialValue = false,
    dialogContent,
    dialogTitle,
    disableEditButton = false,
    disableToggle = false,
    onEditClick,
    onChange,
    id,
}: Props) => {
    const [value, setValue] = useState(initialValue);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const viewOnly = disableToggle && !disableEditButton;

    const handleChange = useDebouncedCallback((value: boolean) => {
        onChange?.(value);

        addSnackMessage({
            id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Parameters Saved',
        });
    }, 800);

    const handleToggleChange = (newValue: boolean) => {
        setValue(newValue);
        handleChange(newValue);
    };

    return (
        <ParameterDrawerInputWrapper
            inputId={id}
            label={label}
            rows="one-row"
            aria-label={`Show description for ${label}`}
            tooltipContent={dialogContent}
            tooltipTitle={dialogTitle}>
            {({ inputLabelId }) => (
                <div
                    className={stack({
                        direction: 'row',
                        justify: 'end',
                        align: 'center',
                        gap: '1',
                    })}>
                    <Button
                        size="small"
                        color="primary"
                        variant="text"
                        onClick={onEditClick}
                        isDisabled={disableEditButton}
                        aria-label={`Edit ${label}`}>
                        {viewOnly ? 'View' : 'Edit'}
                    </Button>
                    <Switch
                        size="large"
                        isSelected={value}
                        isDisabled={disableToggle}
                        onChange={handleToggleChange}
                        aria-labelledby={inputLabelId}
                    />
                </div>
            )}
        </ParameterDrawerInputWrapper>
    );
};
