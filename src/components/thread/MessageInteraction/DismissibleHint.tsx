/**
 * A small UI component for displaying a dismissible hint or message block.
 *
 * @example
 * <DismissibleHint
 *   title="Info"
 *   content="This action cannot be undone."
 *   onClose={handleClose}
 * />
 *
 * @param {DismissibleHintProps} props - The component props.
 * @returns {JSX.Element} Rendered dismissible hint component.
 */

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, StackProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Props for the {@link DismissibleHint} component.
 */
export interface DismissibleHintProps extends Omit<StackProps, 'title'> {
    /** Callback fired when the close control is clicked. */
    onClose: () => void;

    /** Optional heading, can be a string or a React node. */
    title?: ReactNode;

    /** Optional main text as a string; omit to render `children`. */
    content?: string;

    /** Accessible label for the default close button. */
    closeAriaLabel?: string;

    /** Optional custom close control to replace the default. */
    CloseAdornment?: ReactNode;
}

export function DismissibleHint({
    onClose,
    title,
    content,
    children,
    closeAriaLabel = 'close',
    CloseAdornment,
    sx,
    ...stackProps
}: DismissibleHintProps) {
    return (
        <Stack
            direction="row"
            gap={1}
            p={0.5}
            alignItems="flex-start"
            sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...stackProps}>
            <Stack gap={0.5} flex={1} minWidth={0}>
                {title ? (
                    typeof title === 'string' ? (
                        <Typography variant="subtitle2">{title}</Typography>
                    ) : (
                        title
                    )
                ) : null}
                {content ? (
                    typeof content === 'string' ? (
                        <Typography variant="body2">{content}</Typography>
                    ) : (
                        content
                    )
                ) : (
                    children
                )}
            </Stack>

            {CloseAdornment ?? (
                <IconButton
                    aria-label={closeAriaLabel}
                    onClick={onClose}
                    size="small"
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        p: 0.75,
                        color: theme.palette.grey[400],
                    })}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </Stack>
    );
}
