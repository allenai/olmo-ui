import { Box, Theme } from '@mui/material';
import { PropsWithChildren } from 'react';

import { AppContextState, useAppContext } from '@/AppContext';
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

    const spanScorePercentile = useAppContext((state: AppContextState) => {
        const messageId = state.attribution.selectedMessageId;
        if (messageId == null || state.attribution.attributionsByMessageId[messageId] == null) {
            return 0.0;
        }

        const spans = state.attribution.attributionsByMessageId[messageId].spans;
        const documents = state.attribution.attributionsByMessageId[messageId].documents;

        // Compute the global max and min relevance score across all spans
        const maxRelevanceScore = Object.values(spans).reduce((acc, span) => {
            if (span == null) {
                return acc;
            }
            return Math.max(
                acc,
                span.nested_spans.reduce((acc, nestedSpan) => {
                    return nestedSpan.documents.reduce((acc, documentIx) => {
                        const document = documents[documentIx];
                        return Math.max(acc, document?.relevance_score ?? 0.0);
                    }, acc);
                }, 0.0)
            );
        }, 0.0);
        const minRelevanceScore = Object.values(spans).reduce((acc, span) => {
            if (span == null) {
                return acc;
            }
            return Math.min(
                acc,
                span.nested_spans.reduce((acc, nestedSpan) => {
                    return nestedSpan.documents.reduce((acc, documentIx) => {
                        const document = documents[documentIx];
                        return Math.max(acc, document?.relevance_score ?? 0.0);
                    }, acc);
                }, 0.0)
            );
        }, 1000000.0);
        // shouldn't happen, but just in case
        if (maxRelevanceScore <= minRelevanceScore) {
            return 0.0;
        }

        // I don't know why spanIds can be an array, but if it is, we'll just compute the max score
        const spanIdsArray = Array.isArray(spanIds) ? spanIds : [spanIds];
        const spanRelevanceScore = spanIdsArray.reduce((acc, spanId) => {
            const span = spans[spanId];
            if (span == null) {
                return acc;
            }
            const spanRelevanceScore = span.nested_spans.reduce((acc, nestedSpan) => {
                return nestedSpan.documents.reduce((acc, documentIx) => {
                    const document = documents[documentIx];
                    return Math.max(acc, document?.relevance_score ?? 0.0);
                }, acc);
            }, 0.0);
            return Math.max(acc, spanRelevanceScore);
        }, 0.0);

        const spanScorePercentile =
            (spanRelevanceScore - minRelevanceScore) / (maxRelevanceScore - minRelevanceScore);
        return spanScorePercentile;
    });

    return {
        shouldShowHighlight,
        isAttributionSpanFirstEnabled,
        toggleSelectedSpans,
        spanScorePercentile,
    };
};

export interface AttributionHighlightProps extends PropsWithChildren {
    span: string | string[];
    variant?: AttributionHighlightVariant;
    spanScorePercentile: number;
}

export const getHighlightColor = (theme: Theme, spanScorePercentile: number): string => {
    const color0: string = theme.color['pink-20'].hex;
    const color1: string = theme.color['pink-40'].hex;
    const r = Math.round(
        parseInt(color0.slice(1, 3), 16) * (1 - spanScorePercentile) +
            parseInt(color1.slice(1, 3), 16) * spanScorePercentile
    ).toString(16);
    const g = Math.round(
        parseInt(color0.slice(3, 5), 16) * (1 - spanScorePercentile) +
            parseInt(color1.slice(3, 5), 16) * spanScorePercentile
    ).toString(16);
    const b = Math.round(
        parseInt(color0.slice(5, 7), 16) * (1 - spanScorePercentile) +
            parseInt(color1.slice(5, 7), 16) * spanScorePercentile
    ).toString(16);
    const color = `#${r}${g}${b}`;
    return color;
};

export const AttributionHighlight = ({
    span,
    variant = 'default',
    children,
}: AttributionHighlightProps): JSX.Element => {
    const {
        isAttributionSpanFirstEnabled,
        toggleSelectedSpans,
        shouldShowHighlight,
        spanScorePercentile,
    } = useAttributionHighlights(span);

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
                            ? getHighlightColor(theme, spanScorePercentile)
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
