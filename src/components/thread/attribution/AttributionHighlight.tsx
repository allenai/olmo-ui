import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';

export interface AttributionHighlightProps extends PropsWithChildren {
    variant: 'selected' | 'preview';
}

export const AttributionHighlight = ({
    children,
    variant,
}: AttributionHighlightProps): JSX.Element => {
    return <AttributionHighlightButton variant={variant}>{children}</AttributionHighlightButton>;
};

interface AttributionHighlightButtonProps {
    variant: 'selected' | 'preview';
}

const AttributionHighlightButton = styled('button', {
    shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'sx',
})<AttributionHighlightButtonProps>(({ theme, variant }) => ({
    padding: 0,
    margin: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: 0,
    cursor: 'pointer',

    backgroundColor:
        variant === 'selected' ? theme.palette.primary.light : theme.palette.secondary.light,
}));
