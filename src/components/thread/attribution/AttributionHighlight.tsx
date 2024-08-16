import { Box, styled } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

export type AttributionHighlightVariant = 'selected' | 'preview' | 'default';
export interface AttributionHighlightProps extends PropsWithChildren {
    span: string;
    variant: AttributionHighlightVariant;
}

export const AttributionHighlight = ({
    span,
    variant,
    children,
}: AttributionHighlightProps): JSX.Element => {
    const shouldShowHighlight = useAppContext(
        (state) =>
            state.attribution.selectedSpanId == null || state.attribution.selectedSpanId === span
    );

    if (!shouldShowHighlight) {
        return <>{children}</>;
    }

    return (
        <AttributionHighlightButton variant={variant} spanId={span}>
            {children}
        </AttributionHighlightButton>
    );
};

interface AttributionHighlightButtonProps extends PropsWithChildren {
    variant: AttributionHighlightVariant;
    spanId: string;
}

const AttributionHighlightButton = ({
    variant,
    spanId: span,
    children,
}: AttributionHighlightButtonProps) => {
    const featureToggles = useFeatureToggles();
    const selectSpan = useAppContext((state) => state.selectSpan);

    const isDisabled = !featureToggles.attributionSpanFirst;
    const handleClick = () => {
        if (!isDisabled) {
            selectSpan(span);
        }
    };

    return (
        <Box
            component="mark"
            role="button"
            aria-label="Show documents related to this span"
            onClick={handleClick}
            tabIndex={0}
            sx={{
                cursor: !isDisabled ? 'pointer' : undefined,

                backgroundColor: (theme) =>
                    variant === 'selected' || variant === 'default'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,

                color: (theme) =>
                    variant === 'selected' || variant === 'default'
                        ? theme.palette.primary.contrastText
                        : theme.palette.secondary.contrastText,
            }}>
            {children}
        </Box>
    );
};
