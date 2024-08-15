import { styled } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

export interface AttributionHighlightProps extends PropsWithChildren {
    span: string;
    variant: 'selected' | 'preview';
}

export const AttributionHighlight = ({
    span,
    variant,
    children,
}: AttributionHighlightProps): JSX.Element => {
    const featureToggles = useFeatureToggles();
    const setSelectedSpan = useAppContext((state) => state.selectSpan);

    const handleClick = () => {
        setSelectedSpan(span);
    };

    return (
        <AttributionHighlightButton
            variant={variant}
            aria-label={'Show documents related to this span'}
            onClick={handleClick}
            disabled={!featureToggles.attributionSpanFirst}>
            {children}
        </AttributionHighlightButton>
    );
};

interface AttributionHighlightButtonProps {
    variant: 'selected' | 'preview';
    onClick?: MouseEventHandler;
    disabled?: boolean;
}

const AttributionHighlightButton = styled('button', {
    shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'sx',
})<AttributionHighlightButtonProps>(({ theme, variant, onClick, disabled }) => ({
    padding: 0,
    margin: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    border: 0,
    cursor: onClick != null && !disabled ? 'pointer' : undefined,

    backgroundColor:
        variant === 'selected' ? theme.palette.primary.light : theme.palette.secondary.light,
}));
