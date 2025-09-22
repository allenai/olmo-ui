import { DataObject } from '@mui/icons-material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { alpha, MenuItem, menuItemClasses, styled, Typography } from '@mui/material';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import ThinkingSvg from '@/components/assets/thinking.svg?react';

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

interface ModelSelectMenuItemProps {
    model: Model;
}

export const ModelSelectMenuItem = ({ model }: ModelSelectMenuItemProps) => {
    const MenuItemIcon = model.prompt_type === 'multi_modal' ? ImageOutlinedIcon : ChatOutlinedIcon;

    return (
        <CustomMenuItem key={model.id} value={model.id}>
            <MenuItemIcon sx={{ gridArea: 'icon', alignSelf: 'start' }} />
            <Typography sx={{ gridArea: 'title', lineHeight: 1 }}>{model.name}</Typography>
            <Typography sx={{ opacity: 0.55, gridArea: 'features' }} component="div">
                {model.accepts_files ? 'Multimodal' : 'Text-only'}
                {model.internal && ' (Internal)'}
                <ul>
                    {model.can_think && (
                        <ModelSelectFeatureIndicator Icon={ThinkingSvg} feature="Thinking" />
                    )}
                    {model.can_call_tools && (
                        <ModelSelectFeatureIndicator Icon={DataObject} feature="Tool calling" />
                    )}
                </ul>
            </Typography>
        </CustomMenuItem>
    );
};
