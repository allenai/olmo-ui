import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

import { AppContextState, useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import {
    hasAttributionSelectionSelector,
    messageAttributionsSelector,
    shouldShowHighlightsSelector,
} from '@/slices/attribution/attribution-selectors';

import { calculateRelevanceScore } from './calculate-relevance-score';

export type AttributionHighlightVariant = 'selected' | 'preview' | 'default';

export const useAttributionHighlights = (spanIds: string | string[]) => {
    const featureToggles = useFeatureToggles();
    const selectSpans = useAppContext((state) => state.selectSpans);
    const resetSelectedSpans = useAppContext((state) => state.resetCorpusLinkSelection);

    const isSelectedSpan = useAppContext((state) => {
        switch (state.attribution.selection?.type) {
            case undefined:
            case null: // fallthrough
                return false;
            case 'span': {
                const selectedSpanIds = state.attribution.selection.selectedSpanIds;

                return Array.isArray(spanIds)
                    ? selectedSpanIds.some((selectedSpanId) => spanIds.includes(selectedSpanId))
                    : selectedSpanIds.includes(spanIds);
            }
            case 'document': {
                const selectedDocument = state.attribution.selection.documentIndex;
                const messageAttributions = messageAttributionsSelector(state);
                const document = messageAttributions?.documents[selectedDocument];

                return Array.isArray(spanIds)
                    ? spanIds.some((spanId) =>
                          document?.corresponding_spans.includes(Number(spanId))
                      )
                    : document?.corresponding_spans.includes(Number(spanIds));
            }
        }
    });

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

        const hasSelection = hasAttributionSelectionSelector(state);
        // If there aren't any selected spans we want to show all highlights
        if (!hasSelection) {
            return true;
        }

        // If there are selected spans and this is one of them, show the highlight
        if (isSelectedSpan) {
            return true;
        }

        return false;
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
        toggleSelectedSpans,
        spanScorePercentile,
        isSelectedSpan,
    };
};

export interface AttributionHighlightProps extends PropsWithChildren {
    span: number;
    variant?: AttributionHighlightVariant;
    spanScorePercentile: number;
}

export const AttributionHighlight = ({
    span,
    children,
}: AttributionHighlightProps): JSX.Element => {
    const { toggleSelectedSpans, shouldShowHighlight, spanScorePercentile } =
        useAttributionHighlights(span.toString());

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
                return {
                    cursor: 'pointer',

                    '--base-highlight-color': theme.palette.secondary.main,
                    borderBottom: '2px solid var(--base-highlight-color)',
                    backgroundColor: 'var(--base-highlight-color)',

                    '&[data-span-relevance="high"]': {
                        '--background-opacity': '50%',
                    },
                    '&[data-span-relevance="medium"]': {
                        '--background-opacity': '25%',
                    },
                    '&[data-span-relevance="low"]': {
                        '--background-opacity': '10%',
                    },
                    '@supports (color: rgb(from white r g b))': {
                        backgroundColor:
                            'rgb(from var(--base-highlight-color) r g b / var(--background-opacity, 10%))',
                    },

                    // color is hard coded (not theme dependant), because background is always some variation of pink
                    color: theme.palette.text.primary,

                    ':focus-visible': {
                        outlineStyle: 'solid',
                        outlineWidth: 2,
                        outlineColor: 'var(--base-highlight-color)',
                    },
                };
            }}>
            {children}
        </Box>
    );
};
