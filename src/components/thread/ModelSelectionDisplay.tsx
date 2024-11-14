import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    SxProps,
    Typography,
} from '@mui/material';
import { useId } from 'react';

import { Model, ModelList } from '@/api/Model';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { SMALL_THREAD_CONTAINER_QUERY } from '@/utils/container-query-utils';

export enum ModelSelectionDisplayType {
    Always,
    Desktop,
    Mobile,
}

type ModelSelectionDisplayProps = {
    models: ModelList;
    selectedModel?: Model;
    onModelChange: (event: SelectChangeEvent) => void;
    label?: string;
    shouldShow: ModelSelectionDisplayType;
};

export const ModelSelectionDisplay = ({
    models,
    selectedModel,
    onModelChange,
    shouldShow,
    label = '',
}: ModelSelectionDisplayProps) => {
    const selectId = useId();
    const { isPeteishModelEnabled } = useFeatureToggles();
    const newModels = isPeteishModelEnabled
        ? models
        : models.filter((model) => model.name !== 'OLMo-peteish-dpo-preview');

    const responsiveSx: SxProps = (theme) => {
        switch (shouldShow) {
            case ModelSelectionDisplayType.Desktop:
                return {
                    display: 'none',
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        display: 'block',
                    },
                };
            case ModelSelectionDisplayType.Mobile:
                return {
                    [SMALL_THREAD_CONTAINER_QUERY]: {
                        display: 'none',
                    },
                    gridColumn: '1 / -1',
                };
            default:
                return {};
        }
    };
    return (
        <Box sx={responsiveSx}>
            {newModels.length > 1 ? (
                <FormControl
                    sx={{
                        width: shouldShow === ModelSelectionDisplayType.Mobile ? '100%' : undefined,
                        maxWidth: '25rem',
                        justifySelf: 'center',
                    }}>
                    <InputLabel
                        htmlFor={selectId}
                        sx={(theme) => ({
                            background: theme.palette.background.default,
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
