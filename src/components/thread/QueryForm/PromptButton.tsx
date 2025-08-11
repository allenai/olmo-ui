import { IconButton, styled, SxProps } from '@mui/material';

export const promptButtonStyles: SxProps = {
    // TODO Share
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
    '@supports not (selector(:focus-visible) or selector(:has(*)))': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },
};

export const PromptButton = styled(IconButton)(promptButtonStyles);
