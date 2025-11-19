import { styled } from '@mui/material';

export const StyledLabel = styled('label')(({ theme }) => ({
    cursor: 'pointer',
    borderRadius: 'var(--radii-full, 9999px)',
    padding: 4,
    display: 'flex',
    color: 'var(--palette-light-accent-secondary)',

    ':hover': {
        color: 'var(--color-teal-100)',
    },

    ':has(:focus-visible)': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },

    ':has(input[type="file"]:disabled)': {
        color: theme.palette.action.disabled,
        ':hover': {
            cursor: 'default',
        },
    },

    '@supports not (selector(:focus-visible) or selector(:has(*)))': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },
}));