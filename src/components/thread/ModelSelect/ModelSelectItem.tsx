import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { alpha, Box, MenuItem, menuItemClasses, Stack, styled, Typography } from '@mui/material';
import { memo } from 'react';

import type { Model } from '@/api/playgroundApi/additionalTypes';

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

type ModelSelectItemProps = Pick<Model, 'name' | 'id' | 'internal'> & {
    acceptsFiles: Model['accepts_files'];
};

export const ModelSelectItem = memo(function ModelSelectItem({
    name,
    id,
    acceptsFiles,
    internal,
}: ModelSelectItemProps) {
    return (
        <CustomMenuItem key={name} value={id}>
            <Stack direction="row">
                <Box
                    sx={{
                        padding: 1,
                        '>svg': {
                            verticalAlign: 'middle',
                        },
                    }}>
                    {acceptsFiles ? <ImageOutlinedIcon /> : <ChatOutlinedIcon />}
                </Box>
                <Stack direction="column">
                    <Typography>{name}</Typography>
                    <Typography sx={{ opacity: 0.5 }}>
                        {acceptsFiles ? 'Multimodal' : 'Text-only'} {internal && '(Internal)'}
                    </Typography>
                </Stack>
            </Stack>
        </CustomMenuItem>
    );
});
