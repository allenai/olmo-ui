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
        backgroundColor: `color-mix(in srgb, ${theme.vars?.palette.background.reversed} 12%, transparent)`,
    },
    ':hover': {
        backgroundColor: `color-mix(in srgb, ${theme.vars?.palette.background.reversed} 4%, transparent)`,
    },
    [`&.${menuItemClasses.selected}`]: {
        background: `rgba(${theme.vars?.palette.background.paperChannel} / 0.6)`,
        color: theme.vars?.palette.text.primary,
        [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: `color-mix(in srgb, ${theme.vars?.palette.background.reversed} 12%, transparent)`,
        },
        ':hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars?.palette.background.reversed} 4%, transparent)`,
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
    const MenuItemIcon = model.promptType === 'multi_modal' ? ImageOutlinedIcon : ChatOutlinedIcon;

    return (
        // Value MUST be passed in here to make it work with MUI
        // https://github.com/mui/material-ui/issues/31006#issuecomment-1035549630
        <CustomMenuItem value={value} {...rest}>
            <MenuItemIcon sx={{ gridArea: 'icon', alignSelf: 'start' }} />
            <Typography
                sx={{
                    gridArea: 'title',
                    lineHeight: 1,
                    fontWeight: isNewModel ? 'bold' : undefined,
                }}>
                {model.name}
            </Typography>
            <Typography sx={{ opacity: 0.55, gridArea: 'features' }} component="div">
                {model.acceptsFiles ? 'Multimodal' : 'Text-only'}
                {model.internal && ' (Internal)'}
                <ul>
                    {isNewModel && <ModelSelectFeatureIndicator Icon={AutoAwesome} feature="New" />}
                    {model.canThink && (
                        <ModelSelectFeatureIndicator Icon={ThinkingSvg} feature="Thinking" />
                    )}
                    {model.canCallTools && (
                        <ModelSelectFeatureIndicator Icon={ToolCallIcon} feature="Tool calling" />
                    )}
                </ul>
            </Typography>
        </CustomMenuItem>
    );
};
