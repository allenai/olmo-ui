import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { useEffect } from 'react';

import { useAppContext } from '../AppContext';

interface ModelSelectProps {
    disabled?: boolean;
}

export const NewModelSelect = ({ disabled }: ModelSelectProps) => {
    const models = useAppContext((state) => state.models);
    const selectedModel = useAppContext((state) => state.selectedModel);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);

    useEffect(() => {
        if (models) {
            setSelectedModel(models[0].id);
        }
    }, [models]);

    const handleOnChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value as string);
    };

    return (
        <Select
            name="model"
            disabled={disabled}
            value={selectedModel}
            // this keeps the label a the top. it makes it look nicer since the models and templates can arrive at separate times
            sx={{
                flex: '1 1 auto',
            }}
            onChange={handleOnChange}>
            {models?.map((model) => {
                return (
                    <MenuItem key={model.id} value={model.id}>
                        {model.name}
                    </MenuItem>
                );
            })}
        </Select>
    );
};
