import { Tooltip } from '@mui/material';
import { SelectElement, useWatch } from 'react-hook-form-mui';

import { useAppContext } from '../../AppContext';

interface ModelSelectProps {
    disabled?: boolean;
}

export const ModelSelect = ({ disabled }: ModelSelectProps) => {
    const models = useAppContext((state) => state.models);

    const selectedModel = useWatch({ name: 'model' });

    return (
        <Tooltip
            title={models.find((model) => model.id === selectedModel)?.description}
            describeChild
            placement="top">
            <SelectElement
                name="model"
                disabled={disabled}
                options={models.map((model) => ({ id: model.id, label: model.name }))}
                label="Model"
                // this keeps the label at the top. it makes it look nicer since the models and templates can arrive at separate times
                InputLabelProps={{ shrink: true }}
                sx={{
                    flex: '1 1 auto',
                }}
            />
        </Tooltip>
    );
};
