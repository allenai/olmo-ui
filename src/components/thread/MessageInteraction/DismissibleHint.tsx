/**
 * A small UI component for displaying a dismissible hint or message block.
 *
 * The `DismissibleHint` renders optional `title` and `content` areas, with sensible
 * typography defaults for string values. If `content` is not provided, the `children`
 * are rendered instead. The component also includes a close control:
 *   - By default, this is an `IconButton` with an accessible label (`closeAriaLabel`).
 *   - Consumers can override this by passing a custom `CloseAdornment` node.
 *
 * Common usage:
 * <DismissibleHint
 *   title="Info"
 *   content="This action cannot be undone."
 *   onClose={handleClose}
 * />
 *
 * Props:
 * - title: Optional heading, string or node.
 * - content: Optional main text as a string or node; omit to render `children`.
 * - onClose: Callback fired when the close control is clicked.
 * - closeAriaLabel: Accessible label for the default close button.
 * - CloseAdornment: Optional custom close control to replace the default.
 * - All other `StackProps` are forwarded to the root Stack.
 */

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, StackProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface DismissibleHintProps extends Omit<StackProps, 'title'> {
    onClose: () => void;
    title?: ReactNode;
    content?: string | undefined;
    closeAriaLabel?: string;
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
