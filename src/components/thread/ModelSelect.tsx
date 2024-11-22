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
} from '@mui/material';
import { useEffect, useId, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { Model } from '@/api/Model';
import { AppContextState, useAppContext } from '@/AppContext';

import { selectMessagesToShow } from './ThreadDisplay/selectMessagesToShow';

// HACK: This is here because we don't always have the models loaded when the selectedThreadPageLoader is called (if first load is a thread, for example)
// If we find a nice way to wait for models to be populated in that loader we can replace this
const useUpdateSelectedModelWhenLoadingAThread = (
    models: Model[],
    setSelectedModel: (modelId: string) => void
) => {
    const previousSelectedThreadIdRef = useRef<string>();
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));

    const latestThreadContent = useAppContext(
        (state) => state.selectedThreadMessagesById[viewingMessageIds[viewingMessageIds.length - 1]]
    );

    useEffect(() => {
        if (previousSelectedThreadIdRef.current !== selectedThreadId) {
            previousSelectedThreadIdRef.current = selectedThreadId;
            const modelIdList = models.map((model) => model.id);
            // the types for selectedThreadMessagesById aren't quite right
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
        }
    }, [latestThreadContent, models, selectedThreadId, setSelectedModel, viewingMessageIds]);
};

type ModelSelectionDisplayProps = {
    sx?: SxProps<Theme>;
};

export const ModelSelect = ({ sx }: ModelSelectionDisplayProps) => {
    const selectId = useId();
    const label = 'Model';
    const labelId = selectId + '-label';

    const models = useAppContext(
        useShallow((state: AppContextState) => {
            const nonDeprecatedModels = state.models.filter(
                (model) => !model.is_deprecated || model.id === state.selectedModel?.id
            );

            return nonDeprecatedModels;
        })
    );

    const selectedModelId = useAppContext((state) => (state.selectedModel ?? models[0]).id);

    const setSelectedModel = useAppContext((state) => state.setSelectedModel);

    const handleModelChange = (event: SelectChangeEvent) => {
        analyticsClient.trackModelUpdate({ modelChosen: event.target.value });
        setSelectedModel(event.target.value);
    };

    useUpdateSelectedModelWhenLoadingAThread(models, setSelectedModel);

    return (
        <Box sx={sx} paddingInline={2} paddingBlockEnd={2}>
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
                    value={selectedModelId}>
                    {models.map((model) => (
                        <MenuItem key={model.name} value={model.id}>
                            {model.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
