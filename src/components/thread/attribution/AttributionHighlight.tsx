import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

interface AttributionHighlightProps extends PropsWithChildren {
    variant: 'selected' | 'preview';
}

export const AttributionHighlight = ({
    children,
    variant,
}: AttributionHighlightProps): JSX.Element => {
    return (
        <Box
            component="mark"
            sx={{
                backgroundColor: (theme) =>
                    variant === 'selected'
                        ? theme.palette.primary.light
                        : theme.palette.secondary.light,
            }}>
            {children}
        </Box>
    );
};
