import { AddBoxOutlined } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { alpha } from '@mui/system';
import { ReactNode } from 'react';

import { links } from '@/Links';

export const NewChatButton = (): ReactNode => {
    return (
        <ListItem disablePadding dense>
            <ListItemButton
                alignItems="center"
                disableGutters
                href={links.playground}
                sx={(theme) => ({
                    minHeight: theme.spacing(5),
                    marginInline: theme.spacing(2),
                    marginBlockEnd: theme.spacing(1),
                    paddingBlock: theme.spacing(2),
                    paddingInline: theme.spacing(2),
                    gap: theme.spacing(2),
                    color: theme.color['off-white'].hex,
                    borderRadius: '9999px',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),

                    ':hover, :hover > &': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },

                    '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        color: theme.palette.secondary.main,

                        ':hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.1),
                        },

                        ':focus-visible': {
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.secondary.contrastText,
                        },
                    },

                    '&.Mui-focusVisible': {
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.contrastText,
                    },
                })}>
                <ListItemIcon
                    sx={{
                        height: '1.25rem',
                        width: '1.25rem',
                        minWidth: 'unset',
                        '& svg': { fontSize: '1.25rem', transform: 'scale(1.2)' },
                    }}>
                    <AddBoxOutlined color="secondary" />
                </ListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    New chat
                </ListItemText>
                <div />
            </ListItemButton>
        </ListItem>
    );
};
