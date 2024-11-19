import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { useEffect, useId } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model, ModelList } from '@/api/Model';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { selectMessagesToShow } from './ThreadDisplay/selectMessagesToShow';

import { selectMessagesToShow } from './ThreadDisplay/selectMessagesToShow';

type ModelSelectionDisplayProps = {
    models: ModelList;
    selectedModel?: Model;
    onModelChange: (event: SelectChangeEvent) => void;
    label?: string;
};

export const ModelSelectionDisplay = ({
    models,
    selectedModel,
    onModelChange,
    label = '',
}: ModelSelectionDisplayProps) => {
    const selectId = useId();
    const { isPeteishModelEnabled } = useFeatureToggles();
    const newModels = isPeteishModelEnabled
        ? models
        : models.filter((model) => model.name !== 'OLMo-peteish-dpo-preview');

    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const { selectedThreadMessagesById, setSelectedModel } = useAppContext();

    const latestThreadId = viewingMessageIds[viewingMessageIds.length - 1];

    useEffect(() => {
        const latestThreadContent = selectedThreadMessagesById[latestThreadId];
        const modelIdList = models.map((model) => model.id);
        if (latestThreadContent) {
            if (latestThreadContent.model_id && modelIdList.indexOf(latestThreadContent.model_id)) {
                setSelectedModel(latestThreadContent.model_id);
            } else {
                setSelectedModel(modelIdList[0]);
            }
        }
    }, [viewingMessageIds]);

    return (
        <Box>
            {newModels.length > 1 ? (
                <FormControl
                    sx={{
                        maxWidth: '25rem',
                        justifySelf: 'center',
                    }}>
                    <InputLabel
                        htmlFor={selectId}
                        sx={(theme) => ({
                            background: theme.palette.background.paper,
                            paddingX: 1,
                        })}>
                        {label}
                    </InputLabel>
                    <Select
                        id={selectId}
                        fullWidth
                        size="small"
                        onChange={onModelChange}
                        input={<OutlinedInput />}
                        value={(selectedModel && selectedModel.id) || ''}>
                        {newModels.map((model) => (
                            <MenuItem key={model.name} value={model.id}>
                                {model.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Typography key={newModels[0].name}>
                    {label ? `${label}: ` : ''}
                    {newModels[0].name}
                </Typography>
            )}
        </Box>
    );
};
