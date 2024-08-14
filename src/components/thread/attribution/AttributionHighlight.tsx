import { styled } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';

import { useAppContext } from '@/AppContext';

export interface AttributionHighlightProps extends PropsWithChildren {
    span: string;
    variant: 'selected' | 'preview';
}

export const AttributionHighlight = ({
    span,
    variant,
    children,
}: AttributionHighlightProps): JSX.Element => {
    const setSelectedSpan = useAppContext((state) => state.setSelectedSpan);

    const handleClick = () => {
        setSelectedSpan(span);
    };

    return (
        <AttributionHighlightButton variant={variant} onClick={handleClick}>
            {children}
        </AttributionHighlightButton>
    );
};

interface AttributionHighlightButtonProps {
    variant: 'selected' | 'preview';
    onClick?: MouseEventHandler;
}

const AttributionHighlightButton = styled('button', {
    shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'sx',
})<AttributionHighlightButtonProps>(({ theme, variant, onClick }) => ({
    padding: 0,
    margin: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: 0,
    cursor: onClick != null ? 'pointer' : undefined,

    backgroundColor:
        variant === 'selected' ? theme.palette.primary.light : theme.palette.secondary.light,
}));
