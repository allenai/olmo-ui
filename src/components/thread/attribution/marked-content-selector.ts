import { AppContextState, useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { type AttributionHighlightVariant } from './AttributionHighlight';
import { createSpanReplacementRegex } from './span-replacement-regex';

const selectedCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.selectedDocumentIndex == null) {
        return [];
    }

    const documents = messageAttributionsSelector(state)?.documents;
    return documents?.[state.attribution.selectedDocumentIndex]?.corresponding_span_texts ?? [];
};

const previewCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.previewDocumentIndex == null) {
        return [];
    }

    const documents = messageAttributionsSelector(state)?.documents;
    return documents?.[state.attribution.previewDocumentIndex]?.corresponding_span_texts ?? [];
};

type AttributionHighlightString =
    `:attribution-highlight[${string}]{variant="${AttributionHighlightVariant}" span="${string}"}`;
const getAttributionHighlightString = (
    spanKey: string,
    span: string,
    variant: AttributionHighlightVariant
): AttributionHighlightString =>
    `:attribution-highlight[${span}]{variant="${variant}" span="${spanKey}"}`;

export const documentFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        let contentWithMarks = content;

        const selectedSpans = selectedCorrespondingSpansSelector(state);

        selectedSpans.forEach((span) => {
            contentWithMarks = contentWithMarks.replaceAll(
                createSpanReplacementRegex(span),
                getAttributionHighlightString(span, span, 'selected')
            );
        });

        const previewSpans = previewCorrespondingSpansSelector(state);
        const previewSpansThatArentSelected = previewSpans.filter(
            (previewSpan) => !selectedSpans.includes(previewSpan)
        );

        previewSpansThatArentSelected.forEach((span) => {
            contentWithMarks = contentWithMarks.replaceAll(
                createSpanReplacementRegex(span),
                getAttributionHighlightString(span, span, 'preview')
            );
        });

        return contentWithMarks;
    };

export const spanFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        const spans = state.attribution.attributionsByMessageId[messageId]?.spans ?? {};

        const intermediate = Object.entries(spans).reduce((acc, [spanKey, span]) => {
            if (span?.text) {
                return acc.replaceAll(
                    createSpanReplacementRegex(span.text),
                    getAttributionHighlightString(spanKey, span.text, 'default')
                );
            } else {
                return acc;
            }
        }, content);

        return intermediate
            .replaceAll(
                /^((?:[*+>]|(?:#+)|(?:\d.))):attribution-highlight/gm,
                '$1 :attribution-highlight'
            )
            .replaceAll(
                /^:attribution-highlight\[((?:[*+>]|(?:#+)|(?:\d.)))/gm,
                '$1 :attribution-highlight['
            );
    };

export const useSpanHighlighting = (messageId: string) => {
    const { attribution, attributionSpanFirst } = useFeatureToggles();

    const highlightSelector = attributionSpanFirst
        ? spanFirstMarkedContentSelector
        : documentFirstMarkedContentSelector;

    const contentWithMarks = useAppContext((state) => {
        if (!attribution) {
            return state.selectedThreadMessagesById[messageId].content;
        }

        return highlightSelector(messageId)(state);
    });

    return contentWithMarks;
};
