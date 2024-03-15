import { Tooltip } from '@mui/material';
import { SelectElement, useWatch } from 'react-hook-form-mui';

import { useAppContext } from '../../AppContext';

interface ModelSelectProps {
    disabled?: boolean;
}

export const ModelSelect = ({ disabled }: ModelSelectProps) => {
    const models = useAppContext((state) => state.modelInfo.data!);

    const selectedModel = useWatch({ name: 'model' });

    return (
        <Tooltip
            title={models.find((model) => model.id === selectedModel)?.description}
            describeChild
            placement="top">
            <SelectElement
                sx={{
                    flex: '1 1 min-content',
                }}
                name="model"
                disabled={disabled}
                options={models.map((model) => ({ id: model.id, label: model.name }))}
                label="Model"
            />
        </Tooltip>
    );
};
