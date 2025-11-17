import { AutoAwesome } from '@mui/icons-material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {
    alpha,
    MenuItem,
    menuItemClasses,
    type MenuItemProps,
    styled,
    Typography,
} from '@mui/material';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import ThinkingSvg from '@/components/assets/thinking.svg?react';
import { ToolCallIcon } from '@/components/thread/tools/ToolCallWidget/ToolCallWidget';

import { ModelSelectFeatureIndicator } from './ModelSelectFeatureIndicator';

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateAreas: `
        'icon title'
        'icon features'
    `,
    columnGap: '0.5rem',
    rowGap: '0.25rem',

    paddingInline: theme.spacing(1.5),
    paddingBlock: theme.spacing(1.25),

    background: 'transparent',

    [`&.${menuItemClasses.focusVisible}`]: {
        // @ts-expect-error - we need to type the variants with reversed better
        backgroundColor: alpha(theme.palette.background.reversed, 0.12),
    },
    ':hover': {
        // @ts-expect-error - we need to type the variants with reversed better
        backgroundColor: alpha(theme.palette.background.reversed, 0.04),
    },
    [`&.${menuItemClasses.selected}`]: {
        background: alpha(theme.palette.background.paper, 0.6),
        color: theme.palette.text.primary,
        [`&.${menuItemClasses.focusVisible}`]: {
            // @ts-expect-error - we need to type the variants with reversed better
            backgroundColor: alpha(theme.palette.background.reversed, 0.12),
        },
        ':hover': {
            // @ts-expect-error - we need to type the variants with reversed better
            backgroundColor: alpha(theme.palette.background.reversed, 0.04),
        },
    },
}));

interface ModelSelectMenuItemProps extends MenuItemProps {
    model: Model;
    isNewModel?: boolean;
}

export const ModelSelectMenuItem = ({
    model,
    value,
    isNewModel = false,
    ...rest
}: ModelSelectMenuItemProps) => {
    const MenuItemIcon = model.prompt_type === 'multi_modal' ? ImageOutlinedIcon : ChatOutlinedIcon;

    return (
        // Value MUST be passed in here to make it work with MUI
        // https://github.com/mui/material-ui/issues/31006#issuecomment-1035549630
        <CustomMenuItem value={value} {...rest}>
            <MenuItemIcon sx={{ gridArea: 'icon', alignSelf: 'start' }} />
            <Typography sx={{ gridArea: 'title', lineHeight: 1 }}>{model.name}</Typography>
            <Typography sx={{ opacity: 0.55, gridArea: 'features' }} component="div">
                {model.accepts_files ? 'Multimodal' : 'Text-only'}
                {model.internal && ' (Internal)'}
                <ul>
                    {isNewModel && <ModelSelectFeatureIndicator Icon={AutoAwesome} feature="New" />}
                    {model.can_think && (
                        <ModelSelectFeatureIndicator Icon={ThinkingSvg} feature="Thinking" />
                    )}
                    {model.can_call_tools && (
                        <ModelSelectFeatureIndicator Icon={ToolCallIcon} feature="Tool calling" />
                    )}
                </ul>
            </Typography>
        </CustomMenuItem>
    );
};
