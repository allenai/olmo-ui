import {
    Box,
    BoxProps,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Theme,
    Typography,
} from '@mui/material';
import { useId } from 'react';

import { Model, ModelList } from '@/api/Model';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { SMALL_THREAD_CONTAINER_QUERY } from '@/utils/container-query-utils';

type ModelSelectionDisplayProps = Pick<BoxProps, 'sx'> & {
    models: ModelList;
    selectedModel?: Model;
    onModelChange: (event: SelectChangeEvent) => void;
    label?: string;
    isLayoutWide: boolean;
};

export const ModelSelectionDisplay = ({
    models,
    selectedModel,
    onModelChange,
    isLayoutWide,
    label = '',
}: ModelSelectionDisplayProps) => {
    const selectId = useId();
    return (
        <Box
            sx={(theme: Theme) => ({
                // These responsive styles are mirrors to the ones below
                // the display values should be flipped versions
                //
                display: isLayoutWide ? 'none' : 'block', // This is hidden by default (mobile first)
                [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    // it is visible above the DESKTOP_LAYOUT_BREAKPOINT
                    display: isLayoutWide ? 'block' : 'none',
                },
                [SMALL_THREAD_CONTAINER_QUERY]: {
                    // Unlesss the container is too small, then it is hidden again
                    display: isLayoutWide ? 'none' : 'block',
                },
                paddingTop: !isLayoutWide ? 2 : undefined,
                gridColumn: !isLayoutWide ? '1 / -1' : '1',
            })}>
            {models.length > 1 ? (
                <FormControl
                    sx={{
                        width: !isLayoutWide ? '100%' : undefined,
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
                        {models.map((model) => (
                            <MenuItem key={model.name} value={model.id}>
                                {model.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Typography key={models[0].name}>
                    {label ? `${label}: ` : ''}
                    {models[0].name}
                </Typography>
            )}
        </Box>
    );
};
