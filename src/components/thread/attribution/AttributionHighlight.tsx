import { Box, Theme } from '@mui/material';
import { PropsWithChildren } from 'react';

import { AppContextState, useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import {
    hasSelectedSpansSelector,
    shouldShowHighlightsSelector,
} from '@/slices/attribution/attribution-selectors';

import { calculateRelevanceScore } from './calculate-relevance-score';

export type AttributionHighlightVariant = 'selected' | 'preview' | 'default';

export const useAttributionHighlights = (spanIds: string | string[]) => {
    const featureToggles = useFeatureToggles();
    const selectSpans = useAppContext((state) => state.selectSpans);
    const resetSelectedSpans = useAppContext((state) => state.resetCorpusLinkSelection);

    const isSelectedSpan = useAppContext((state) => {
        const isSpanIdSelected = (spanId: string) =>
            state.attribution.selection?.type === 'span' &&
            state.attribution.selection.selectedSpanIds.includes(spanId);

        if (Array.isArray(spanIds)) {
            return spanIds.some(isSpanIdSelected);
        } else {
            return isSpanIdSelected(spanIds);
        }
    });

    const isBucketColorsEnabled = featureToggles.bucketColors;

    const toggleSelectedSpans = () => {
        if (isSelectedSpan) {
            resetSelectedSpans();
        } else {
            selectSpans(spanIds);
        }
    };

    const shouldShowHighlight = useAppContext((state) => {
        if (!shouldShowHighlightsSelector(state)) {
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

        // I don't know why spanIds can be an array, but if it is, we'll just compute the max score
        const spanIdsArray = Array.isArray(spanIds) ? spanIds : [spanIds];
        const spanRelevanceScore = spanIdsArray.reduce((acc, spanId) => {
            const span = spans[spanId];
            if (span == null) {
                return acc;
            }
            const nestedSpanRelevanceScore = span.nested_spans.reduce((acc, nestedSpan) => {
                return nestedSpan.documents.reduce((acc, documentIx) => {
                    const document = documents[documentIx];
                    return Math.max(acc, document?.relevance_score ?? 0.0);
                }, acc);
            }, 0.0);
            return Math.max(acc, nestedSpanRelevanceScore);
        }, 0.0);

        if (featureToggles.absoluteSpanScore) {
            // Absolute scoring based on response length
            const message = state.selectedThreadMessagesById[messageId];
            // message can be undefined but our typing isn't quite right
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!message?.content) return 0.0;

            return calculateRelevanceScore(spanRelevanceScore, message.content.length);
        }

        // Relative scoring based on min/max normalization
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

        return (spanRelevanceScore - minRelevanceScore) / (maxRelevanceScore - minRelevanceScore);
    });

    return {
        shouldShowHighlight,
        isBucketColorsEnabled,
        toggleSelectedSpans,
        spanScorePercentile,
    };
};

export interface AttributionHighlightProps extends PropsWithChildren {
    span: string | string[];
    variant?: AttributionHighlightVariant;
    spanScorePercentile: number;
}

export const getHighlightColor = (
    theme: Theme,
    spanScorePercentile: number,
    isBucketColorsEnabled: boolean
): string => {
    if (isBucketColorsEnabled) {
        if (spanScorePercentile >= 0.7) {
            return theme.color['green-40'].toString();
        } else if (spanScorePercentile >= 0.5) {
            return theme.color['orange-40'].toString();
        } else {
            return theme.color['pink-30'].toString();
        }
    }

    const color0 = theme.color['pink-20'].rgba;
    const color1 = theme.color['pink-40'].rgba;
    const r = Math.round(color0.r * (1 - spanScorePercentile) + color1.r * spanScorePercentile);
    const g = Math.round(color0.g * (1 - spanScorePercentile) + color1.g * spanScorePercentile);
    const b = Math.round(color0.b * (1 - spanScorePercentile) + color1.b * spanScorePercentile);
    const a = Math.round(color0.a * (1 - spanScorePercentile) + color1.a * spanScorePercentile);
    const color = `rgba(${r}, ${g}, ${b}, ${a})`;
    return color;
};

export const AttributionHighlight = ({
    span,
    variant = 'default',
    children,
}: AttributionHighlightProps): JSX.Element => {
    const { toggleSelectedSpans, shouldShowHighlight, spanScorePercentile } =
        useAttributionHighlights(span);

    if (!shouldShowHighlight) {
        return <>{children}</>;
    }

    const spanRelevance =
        spanScorePercentile >= 0.7 ? 'high' : spanScorePercentile >= 0.5 ? 'medium' : 'low';

    return (
        <Box
            component="mark"
            role="button"
            aria-label="Show documents related to this span"
            onClick={() => {
                toggleSelectedSpans();
            }}
            tabIndex={0}
            data-span-relevance={spanRelevance}
            sx={(theme) => {
                const isPrimaryVariant = variant === 'selected' || variant === 'default';

                return {
                    cursor: 'pointer',
                    '--base-highlight-color': theme.palette.secondary.main,
                    borderBottom: '2px solid var(--base-highlight-color)',
                    '&[data-span-relevance="high"]': {
                        backgroundColor: `rgb(from var(--base-highlight-color) r g b / 50%)`,
                    },
                    '&[data-span-relevance="medium"]': {
                        backgroundColor: `rgb(from var(--base-highlight-color) r g b / 25%)`,
                    },
                    '&[data-span-relevance="low"]': {
                        backgroundColor: `rgb(from var(--base-highlight-color) r g b / 10%)`,
                    },

                    // color is hard coded (not theme dependant), because background is always some variation of pink
                    color: theme.color['off-white'].hex,

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
