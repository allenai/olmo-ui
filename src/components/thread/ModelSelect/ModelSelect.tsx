import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
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
    selectClasses,
    SelectProps,
    Stack,
    styled,
    Typography,
} from '@mui/material';
import { useId } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';

export interface ModelSelectProps {
    models: Model[];
    selectedModelId?: string;
    onModelChange: SelectProps<string>['onChange'];
    id?: string;
}
export const ModelSelect = ({
    id,
    models,
    selectedModelId: maybeSelectedModel,
    onModelChange: handleModelChange,
}: ModelSelectProps): JSX.Element => {
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
                        const MenuItemIcon =
                            model.prompt_type === 'multi_modal'
                                ? ImageOutlinedIcon
                                : ChatOutlinedIcon;

                        return (
                            <CustomMenuItem key={model.id} value={model.id}>
                                <Stack direction="row">
                                    <Box
                                        sx={{
                                            padding: 1,
                                            '> svg': {
                                                verticalAlign: 'middle',
                                            },
                                        }}>
                                        <MenuItemIcon />
                                    </Box>
                                    <Stack direction="column">
                                        <Typography>{model.name}</Typography>
                                        <Typography sx={{ opacity: 0.5 }}>
                                            {model.accepts_files ? 'Multimodal' : 'Text-only'}
                                            {model.internal && ' (Internal)'}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CustomMenuItem>
                        );
                    })}
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
        background: alpha(theme.palette.background.paper, 0.6),
        color: theme.palette.text.primary,
        [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: alpha(theme.palette.common.black, 0.12),
        },
        ':hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.04),
        },
    },
}));
