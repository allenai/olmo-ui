import {
    Box,
    FormControl,
    InputBase,
    inputBaseClasses,
    InputBaseProps,
    Select,
    selectClasses,
    styled,
    SxProps,
    Theme,
} from '@mui/material';
import { useEffect, useId, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { AppContextState, useAppContext } from '@/AppContext';

import { selectMessagesToShow } from '../ThreadDisplay/selectMessagesToShow';
import { ModelSelectItem } from './ModelSelectItem';
import { useHandleChangeModel } from './useHandleChangeModel';

// HACK: This is here because we don't always have the models loaded when the selectedThreadPageLoader is called (if first load is a thread, for example)
// If we find a nice way to wait for models to be populated in that loader we can replace this
const useUpdateSelectedModelWhenLoadingAThread = (models: Model[]) => {
    const previousSelectedThreadIdRef = useRef<string>();
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const viewingMessageIds = useAppContext(useShallow(selectMessagesToShow));
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);

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

    const { handleModelChange, ModelSwitchWarningModal } = useHandleChangeModel();

    useUpdateSelectedModelWhenLoadingAThread(models);

    return (
        <Box sx={sx} paddingInline={2} paddingBlockEnd={2}>
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
                                    overflow: 'visible',
                                }),
                            },
                        },
                        MenuListProps: {
                            sx: (theme) => ({
                                borderRadius: theme.spacing(1),
                                backgroundColor: theme.palette.background.drawer.secondary,
                                overflow: 'hidden',
                                padding: 0,
                                boxShadow: 1,
                            }),
                        },
                    }}
                    value={selectedModelId}
                    renderValue={(value) => {
                        return models.find((model) => model.id === value)?.name;
                    }}>
                    {models.map((model) => {
                        return (
                            <ModelSelectItem
                                key={model.id}
                                name={model.name}
                                id={model.id}
                                acceptsFiles={model.accepts_files}
                                internal={model.internal}
                            />
                        );
                    })}
                </Select>
            </FormControl>
            <ModelSwitchWarningModal />
        </Box>
    );
};

const CustomInput = styled((props: InputBaseProps) => <InputBase {...props} />)(({ theme }) => ({
    borderRadius: '999px',
    backgroundColor: theme.palette.background.drawer.secondary,
    backgroundImage: 'none',
    color: theme.palette.text.primary,
    minWidth: '16rem',
    border: '2px solid transparent',
    '&.Mui-focused': {
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
            paddingInlineEnd: theme.spacing(6),
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
