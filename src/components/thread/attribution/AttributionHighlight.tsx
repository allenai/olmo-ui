import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

export type AttributionHighlightVariant = 'selected' | 'preview' | 'default';

interface AttributionHighlightButtonProps extends PropsWithChildren {
    variant: AttributionHighlightVariant;
    spanId: string;
}

const AttributionHighlightButton = ({
    variant,
    spanId,
    children,
}: AttributionHighlightButtonProps) => {
    const featureToggles = useFeatureToggles();
    const selectSpan = useAppContext((state) => state.selectSpan);
    const resetSelectedSpan = useAppContext((state) => state.resetSelectedSpan);
    const isSelectedSpan = useAppContext((state) => state.attribution.selectedSpanId === spanId);

    const isEnabled = featureToggles.attributionSpanFirst;
    const toggleSelectedSpan = () => {
        if (isEnabled) {
            if (isSelectedSpan) {
                resetSelectedSpan();
            } else {
                selectSpan(spanId);
            }
        }
    };

    return (
        <Box
            component="mark"
            role="button"
            aria-label="Show documents related to this span"
            onClick={toggleSelectedSpan}
            tabIndex={0}
            sx={() => {
                const isPrimaryVariant = variant === 'selected' || variant === 'default';

                return {
                    cursor: isEnabled ? 'pointer' : undefined,

                    backgroundColor: (theme) =>
                        isPrimaryVariant
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,

                    color: (theme) =>
                        isPrimaryVariant
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText,

                    ':focus-visible': {
                        outlineStyle: 'solid',
                        outlineWidth: 2,
                        outlineColor: (theme) =>
                            isPrimaryVariant
                                ? theme.palette.primary.dark
                                : theme.palette.secondary.dark,
                    },
                };
            }}>
            {children}
        </Box>
    );
};

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
            state.shouldShowAllHighlight &&
            (state.attribution.selectedSpanId == null || state.attribution.selectedSpanId === span)
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
