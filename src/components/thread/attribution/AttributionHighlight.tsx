import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { hasSelectedSpansSelector } from '@/slices/attribution/attribution-selectors';

export type AttributionHighlightVariant = 'selected' | 'preview' | 'default';

export const useAttributionHighlights = (spanIds: string | string[]) => {
    const featureToggles = useFeatureToggles();
    const selectSpans = useAppContext((state) => state.selectSpans);
    const resetSelectedSpans = useAppContext((state) => state.resetSelectedSpans);

    const isSelectedSpan = useAppContext((state) => {
        const isSpanIdSelected = (spanId: string) =>
            state.attribution.selectedSpanIds.includes(spanId);

        if (Array.isArray(spanIds)) {
            return spanIds.some(isSpanIdSelected);
        } else {
            return isSpanIdSelected(spanIds);
        }
    });

    const isAttributionSpanFirstEnabled = featureToggles.attributionSpanFirst;

    const toggleSelectedSpans = () => {
        if (isAttributionSpanFirstEnabled) {
            if (isSelectedSpan) {
                resetSelectedSpans();
            } else {
                selectSpans(spanIds);
            }
        }
    };

    const shouldShowHighlight = useAppContext((state) => {
        if (!state.isAllHighlightVisible) {
            return false;
        }

        const hasSelectedSpans = hasSelectedSpansSelector(state);
        // If there aren't any selected spans we want to show all highlights
        if (!hasSelectedSpans) {
            return true;
        }

        // If there are selected spans and this is one of them, show the highlight
        if (isSelectedSpan) {
            return true;
        }
    });

    return {
        shouldShowHighlight,
        isAttributionSpanFirstEnabled,
        toggleSelectedSpans,
    };
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
    const { isAttributionSpanFirstEnabled, toggleSelectedSpans, shouldShowHighlight } =
        useAttributionHighlights(span);

    if (!shouldShowHighlight) {
        return <>{children}</>;
    }

    return (
        <Box
            component="mark"
            role="button"
            aria-label="Show documents related to this span"
            onClick={() => {
                console.log('toggle');
                toggleSelectedSpans();
            }}
            tabIndex={0}
            sx={() => {
                const isPrimaryVariant = variant === 'selected' || variant === 'default';

                return {
                    cursor: isAttributionSpanFirstEnabled ? 'pointer' : undefined,

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
