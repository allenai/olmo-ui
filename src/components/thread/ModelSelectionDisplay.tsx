import {
    alpha,
    Box,
    FormControl,
    InputBase,
    inputBaseClasses,
    InputBaseProps,
    MenuItem,
    menuItemClasses,
    Select,
    SelectChangeEvent,
    selectClasses,
    styled,
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
                    variant="standard"
                    sx={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                    }}>
                    <Box
                        component="label"
                        id={labelId}
                        htmlFor={selectId}
                        sx={{
                            background: 'transparent',
                            paddingX: 1,
                        }}>
                        Model:{' '}
                    </Box>
                    <Select
                        id={selectId}
                        labelId={labelId}
                        fullWidth
                        size="small"
                        onChange={handleModelChange}
                        input={<CustomInput />}
                        MenuProps={{
                            slotProps: {
                                paper: {
                                    sx: (theme) => ({
                                        background: theme.palette.background.drawer.secondary,
                                        borderRadius: theme.spacing(1),
                                    }),
                                },
                            },
                        }}
                        value={(selectedModel && selectedModel.id) || ''}>
                        {newModels.map((model) => (
                            <CustomMenuItem key={model.name} value={model.id}>
                                {model.name}
                            </CustomMenuItem>
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

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    background: theme.palette.background.drawer.secondary,
    [`&.${menuItemClasses.root}`]: {
        background: theme.palette.background.drawer.secondary,
    },
    [`&.${menuItemClasses.focusVisible}`]: {
        backgroundColor: '#FF0000',
    },
    ':hover': {
        backgroundColor: alpha(theme.color['dark-teal'].hex, 0.5),
    },
    [`&.${menuItemClasses.selected}`]: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
        },
        ':hover': {
            backgroundColor: 'rgba(255, 0, 255, 0.25)',
        },
    },
}));

const CustomInput = styled((props: InputBaseProps) => <InputBase {...props} />)(({ theme }) => ({
    borderRadius: '999px',
    backgroundColor: theme.palette.background.drawer.secondary,
    backgroundImage: 'none',
    color: theme.palette.primary.main,

    minWidth: '15rem',
    border: '2px solid transparent',
    [`:focus, :focus-within`]: {
        borderColor: theme.palette.secondary.main,
    },
    [`.${inputBaseClasses.input}`]: {
        paddingBlock: theme.spacing(1),
        paddingInlineStart: theme.spacing(2),
        paddingInlineEnd: theme.spacing(3),

        '&:focus': {
            backgroundColor: 'transparent',
        },
        [`&.${inputBaseClasses.input}`]: {
            paddingInlineEnd: theme.spacing(2),
        },
        [`.${inputBaseClasses.focused}`]: {
            borderColor: theme.palette.secondary.main,
        },
    },
    [`.${selectClasses.icon}`]: {
        marginInlineEnd: theme.spacing(1),
        transform: 'scale(1.2) translateY(-1px)',
    },
}));
