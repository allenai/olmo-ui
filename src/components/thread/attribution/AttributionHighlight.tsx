import { Box } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';

import { AppContextState, useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import {
    hasSelectedAttributionSelector,
    messageAttributionsSelector,
} from '@/slices/attribution/attribution-selectors';

import { ATTRIBUTION_HIGHLIGHT_DESCRIPTION_ID } from './AttributionHighlightDescription';
import { calculateRelevanceScore, getBucketForScorePercentile } from './calculate-relevance-score';

export type AttributionHighlightVariant = 'selected' | 'preview' | 'default';

export const useAttributionHighlights = (spanIds: string | string[]) => {
    const featureToggles = useFeatureToggles();
    const selectSpans = useAppContext((state) => state.selectSpans);
    const resetSelectedSpans = useAppContext((state) => state.resetCorpusLinkSelection);
    const openDrawer = useAppContext((state) => state.openDrawer);

    const [isSelectedSpan, selectionType] = useAppContext(
        (state): [boolean, 'span' | 'document' | null] => {
            switch (state.attribution.selection?.type) {
                case undefined:
                case null: // fallthrough
                    return [false, null];
                case 'span': {
                    const selectedSpanIds = state.attribution.selection.selectedSpanIds;

                    const isSelectedSpan = Array.isArray(spanIds)
                        ? selectedSpanIds.some((selectedSpanId) => spanIds.includes(selectedSpanId))
                        : selectedSpanIds.includes(spanIds);

                    return [isSelectedSpan, 'span'];
                }
                case 'document': {
                    const selectedDocument = state.attribution.selection.documentIndex;
                    const messageAttributions = messageAttributionsSelector(state);
                    const document = messageAttributions?.documents[selectedDocument];

                    const isSelectedSpan = Array.isArray(spanIds)
                        ? spanIds.some((spanId) =>
                              // HACK: our types are a little mismatched rn. we'll need to reconcile this in the future
                              // spanId is a string here but a number in corresponding_spans. It's always a number in a string right now
                              document?.corresponding_spans.includes(Number(spanId))
                          )
                        : document?.corresponding_spans.includes(Number(spanIds)) ?? false;

                    return [isSelectedSpan, 'document'];
                }
            }
        }
    );

    const toggleSelectedSpans = () => {
        if (isSelectedSpan) {
            resetSelectedSpans();
        } else {
            selectSpans(spanIds);
            openDrawer('attribution');
        }
    };

    const shouldShowHighlight = useAppContext((state) => {
        const hasSelection = hasSelectedAttributionSelector(state);
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
        selectionType,
    };
};

export interface AttributionHighlightProps extends PropsWithChildren {
    span: string | string[];
}

export const AttributionHighlight = ({
    span,
    children,
}: AttributionHighlightProps): JSX.Element => {
    const {
        toggleSelectedSpans,
        shouldShowHighlight,
        spanScorePercentile,
        isSelectedSpan,
        selectionType,
    } = useAttributionHighlights(span);

    useEffect(() => {
        if (isSelectedSpan) {
            document.querySelector('mark[data-selection-type="document"]')?.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }
    }, [isSelectedSpan]);

    if (!shouldShowHighlight) {
        return <>{children}</>;
    }

    const spanRelevance = getBucketForScorePercentile(spanScorePercentile);

    return (
        <Box
            component="mark"
            role="button"
            aria-describedby={ATTRIBUTION_HIGHLIGHT_DESCRIPTION_ID}
            onClick={(e) => {
                e.preventDefault();
                toggleSelectedSpans();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    toggleSelectedSpans();
                }
            }}
            tabIndex={0}
            data-span-relevance={spanRelevance}
            data-selection-type={isSelectedSpan ? selectionType : undefined}
            sx={(theme) => {
                return {
                    cursor: 'pointer',

                    '--base-highlight-color': theme.palette.secondary.main,
                    borderBottom: '2px solid var(--base-highlight-color)',

                    // fallback if relative colors aren't supported
                    backgroundColor: 'var(--base-highlight-color)',
                    color: theme.palette.secondary.contrastText,

                    '@supports (color: rgb(from white r g b))': {
                        '&[data-span-relevance="high"]': {
                            '--background-opacity': '50%',
                        },

                        '&[data-span-relevance="medium"]': {
                            '--background-opacity': '25%',
                        },

                        '&[data-span-relevance="low"]': {
                            '--background-opacity': '10%',
                        },

                        backgroundColor:
                            'rgb(from var(--base-highlight-color) r g b / var(--background-opacity, 10%))',
                        color: theme.palette.text.primary,
                    },

                    // We only have a special highlight state for spans when the selection type is span
                    // If this is shown through a document selection we want to keep the normal span highlights
                    '&[data-selection-type="span"]': {
                        backgroundColor: 'var(--base-highlight-color)',
                        color: theme.palette.secondary.contrastText,
                    },

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
