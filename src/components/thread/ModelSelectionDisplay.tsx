import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    SxProps,
    Theme,
    Typography,
} from '@mui/material';
import { useEffect, useId } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { Model, ModelList } from '@/api/Model';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { selectMessagesToShow } from './ThreadDisplay/selectMessagesToShow';

type ModelSelectionDisplayProps = {
    models: ModelList;
    selectedModel?: Model;
    onModelChange: (event: SelectChangeEvent) => void;
    label?: string;
    sx?: SxProps<Theme>;
};

export const ModelSelectionDisplay = ({
    models,
    selectedModel,
    onModelChange,
    label = '',
    sx,
}: ModelSelectionDisplayProps) => {
    const selectId = useId();
    const labelId = selectId + '-label';

    const { isPeteishModelEnabled } = useFeatureToggles();
    const newModels = isPeteishModelEnabled
        ? models
        : models.filter((model) => model.name !== 'OLMo-peteish-dpo-preview');

    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const selectedThreadMessagesById = useAppContext((state) => state.selectedThreadMessagesById);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);

    const latestThreadId = viewingMessageIds[viewingMessageIds.length - 1];

    useEffect(() => {
        const latestThreadContent = selectedThreadMessagesById[latestThreadId];
        const modelIdList = models.map((model) => model.id);
        if (latestThreadContent) {
            if (
                latestThreadContent.model_id &&
                modelIdList.includes(latestThreadContent.model_id)
            ) {
                setSelectedModel(latestThreadContent.model_id);
            } else {
                setSelectedModel(modelIdList[0]);
            }
        }
    }, [viewingMessageIds]);

    const handleModelChange = (event: SelectChangeEvent) => {
        analyticsClient.trackModelUpdate({ modelChosen: event.target.value });
        onModelChange(event);
    };

    return (
        <Box sx={sx} paddingInline={2} paddingBlockEnd={2}>
            {newModels.length > 1 ? (
                <FormControl
                    sx={{
                        maxWidth: '25rem',
                        justifySelf: 'center',
                    }}>
                    <InputLabel
                        id={labelId}
                        htmlFor={selectId}
                        sx={(theme) => ({
                            background: theme.palette.background.paper,
                            paddingX: 1,
                        })}>
                        {label}
                    </InputLabel>
                    <Select
                        id={selectId}
                        labelId={labelId}
                        fullWidth
                        size="small"
                        onChange={handleModelChange}
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
