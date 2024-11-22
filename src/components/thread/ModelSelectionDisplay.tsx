import {
    alpha,
    Box,
    FormControl,
    InputBase,
    inputBaseClasses,
    InputBaseProps,
    menuClasses,
    MenuItem,
    menuItemClasses,
    paperClasses,
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
                            paddingInlineStart: 2,
                            paddingInlineEnd: 2,
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
                                        background: 'transparent',
                                        paddingInline: theme.spacing(1.5),
                                        paddingBlock: '0',
                                        boxShadow: 'none',
                                    }),
                                },
                            },
                            MenuListProps: {
                                sx: (theme) => ({
                                    borderRadius: theme.spacing(1),
                                    overflow: 'hidden',
                                    backgroundColor: theme.palette.background.drawer.secondary,
                                    padding: 0,
                                    boxShadow: 1,
                                }),
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
    paddingInline: theme.spacing(1.5),

    background: 'transparent',

    [`&.${menuItemClasses.focusVisible}`]: {
        backgroundColor: alpha(theme.palette.common.black, 0.12),
    },
    ':hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.04),
    },
    [`&.${menuItemClasses.selected}`]: {
        background: 'transparent',
        color: theme.palette.primary.main,
        [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: alpha(theme.palette.common.black, 0.12),
        },
        ':hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.04),
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
        paddingInlineStart: theme.spacing(3),
        paddingInlineEnd: theme.spacing(4),

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
        marginInlineEnd: theme.spacing(2),
        transform: 'scale(1.2) translateY(0px)',
        fill: theme.palette.primary.main,
    },
}));
