import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';

import { useAppContext } from '@/AppContext';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

interface ModelSelectProps {
    disabled?: boolean;
    onChange?: (event: SelectChangeEvent) => void;
    id?: string;
}

export const ModelSelectInput = ({ disabled, onChange }: ModelSelectProps) => {
    const models = useAppContext((state) => state.models);
    const selectedModel = useAppContext((state) => state.selectedModel);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    useEffect(() => {
        if (models.length !== 0) {
            setSelectedModel(models[0].id);
        }
    }, [models]);

    const handleOnChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value);

        if (onChange) {
            onChange(event);
        }

        addSnackMessage({
            id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Parameters Saved',
        });
    };

    return (
        <ParameterDrawerInputWrapper label="Model" inputId="model">
            {({ inputLabelId }) => (
                <Select
                    name="model"
                    labelId={inputLabelId}
                    disabled={disabled}
                    value={selectedModel}
                    fullWidth
                    onChange={handleOnChange}>
                    {models.map((model) => {
                        return (
                            <MenuItem key={model.id} value={model.id}>
                                {model.name}
                            </MenuItem>
                        );
                    })}
                </Select>
            )}
        </ParameterDrawerInputWrapper>
    );
};
