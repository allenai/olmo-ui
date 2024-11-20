import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Theme,
    Typography,
} from '@mui/material';
import { useEffect, useId } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model, ModelList } from '@/api/Model';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { SMALL_THREAD_CONTAINER_QUERY } from '@/utils/container-query-utils';

import { selectMessagesToShow } from './ThreadDisplay/selectMessagesToShow';

type ModelSelectionDisplayProps = {
    models: ModelList;
    selectedModel?: Model;
    onModelChange: (event: SelectChangeEvent) => void;
    label?: string;
    shouldOnlyShowAtDesktop: boolean;
};

export const ModelSelectionDisplay = ({
    models,
    selectedModel,
    onModelChange,
    shouldOnlyShowAtDesktop,
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

    return (
        <Box
            sx={(theme: Theme) => ({
                // These responsive styles are mirrors to the ones below
                // the display values should be flipped versions
                //
                display: shouldOnlyShowAtDesktop ? 'none' : 'block', // This is hidden by default (mobile first)
                [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    // it is visible above the DESKTOP_LAYOUT_BREAKPOINT
                    display: shouldOnlyShowAtDesktop ? 'block' : 'none',
                },
                [SMALL_THREAD_CONTAINER_QUERY]: {
                    // Unlesss the container is too small, then it is hidden again
                    display: shouldOnlyShowAtDesktop ? 'none' : 'block',
                },
                paddingTop: !shouldOnlyShowAtDesktop ? 2 : undefined,
                gridColumn: !shouldOnlyShowAtDesktop ? '1 / -1' : '1',
            })}>
            {newModels.length > 1 ? (
                <FormControl
                    sx={{
                        width: !shouldOnlyShowAtDesktop ? '100%' : undefined,
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
