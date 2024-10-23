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

    const openDrawer = useAppContext((state) => state.openDrawer);

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
            openDrawer('attribution');
            if (isSelectedSpan) {
                resetSelectedSpans();
            } else {
                selectSpans(spanIds);
            }
        }
    };

    const shouldShowHighlight = useAppContext((state) => {
        if (!state.attribution.isAllHighlightVisible) {
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
    span: string | string[];
    variant?: AttributionHighlightVariant;
}

export const AttributionHighlight = ({
    span,
    variant = 'default',
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
                toggleSelectedSpans();
            }}
            tabIndex={0}
            sx={() => {
                const isPrimaryVariant = variant === 'selected' || variant === 'default';

                return {
                    cursor: isAttributionSpanFirstEnabled ? 'pointer' : undefined,
                    textDecoration: 'underline',
                    backgroundColor: (theme) =>
                        isPrimaryVariant
                            ? theme.color['pink-30'].hex
                            : theme.palette.tertiary.light,

                    color: (theme) =>
                        isPrimaryVariant
                            ? theme.palette.text.primary
                            : theme.palette.tertiary.contrastText,

                    ':focus-visible': {
                        outlineStyle: 'solid',
                        outlineWidth: 2,
                        outlineColor: (theme) =>
                            isPrimaryVariant
                                ? theme.palette.primary.dark
                                : theme.palette.tertiary.dark,
                    },
                };
            }}>
            {children}
        </Box>
    );
};
