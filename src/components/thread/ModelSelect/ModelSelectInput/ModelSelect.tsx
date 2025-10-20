import {
    Box,
    FormControl,
    InputBase,
    inputBaseClasses,
    InputBaseProps,
    Select,
    selectClasses,
    SelectProps,
    styled,
} from '@mui/material';
import { type ReactNode, useId } from 'react';

import type { ModelList } from '@/api/playgroundApi/additionalTypes';

import { ModelSelectMenuItem } from './ModelSelectMenuItem';

export interface ModelSelectProps extends Pick<SelectProps<string>, 'defaultOpen'> {
    models: ModelList;
    selectedModelId?: string;
    onModelChange: SelectProps<string>['onChange'];
    id?: string;
}
export const ModelSelect = ({
    id,
    models,
    selectedModelId: maybeSelectedModel,
    onModelChange: handleModelChange,
    ...rest
}: ModelSelectProps): ReactNode => {
    const fallbackId = useId();
    const selectId = id ?? fallbackId;
    const labelId = selectId + '-label';

    const selectedModelId = maybeSelectedModel ?? models[0]?.id;

    return (
        <Box paddingInline={2} paddingBlockEnd={2}>
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
                    {...rest}
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
                                    borderRadius: theme.spacing(1),
                                    paddingInline: 0,
                                    paddingBlock: 0,
                                    boxShadow: 1,
                                    backgroundColor: theme.palette.background.drawer.secondary,
                                }),
                            },
                        },
                        MenuListProps: {
                            sx: {
                                padding: 0,
                            },
                        },
                    }}
                    value={selectedModelId}
                    renderValue={(value) => {
                        return models.find((model) => model.id === value)?.name;
                    }}>
                    {models.map((model) => (
                        // Value MUST be passed in here to make it work with MUI
                        // https://github.com/mui/material-ui/issues/31006#issuecomment-1035549630
                        <ModelSelectMenuItem key={model.id} model={model} value={model.id} />
                    ))}
                </Select>
            </FormControl>
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
