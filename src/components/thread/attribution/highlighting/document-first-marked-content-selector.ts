import { TopLevelAttributionSpan } from '@/api/AttributionClient';
import { AppContextState } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { escapeBraces } from './escape-braces';
import { removeMarkdownCharactersFromStartAndEndOfSpan } from './escape-markdown-in-span';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

const correspondingSpansSelector =
    (documentIndex?: string | null) =>
    (state: AppContextState): [string, TopLevelAttributionSpan | undefined][] => {
        const message = messageAttributionsSelector(state);
        if (documentIndex == null || message == null) {
            return [];
        }

        const correspondingSpanIds = message.documents[documentIndex]?.corresponding_spans ?? [];

        return correspondingSpanIds.map((correspondingSpanId) => [
            correspondingSpanId.toString(),
            message.spans[correspondingSpanId],
        ]);
    };

const selectedCorrespondingSpansSelector = (state: AppContextState) => {
    return correspondingSpansSelector(state.attribution.selectedDocumentIndex)(state);
};

const previewCorrespondingSpansSelector = (state: AppContextState) => {
    return correspondingSpansSelector(state.attribution.previewDocumentIndex)(state);
};

const formatSpan = (variant: 'selected' | 'preview', spanKey: string, spanText?: string) => {
    if (!spanText) {
        return {};
    }

    const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(spanText);

    const spanReplacementRegex = createSpanReplacementRegex(escapedSpanText);

    const spanDisplayText = escapeBraces(escapedSpanText);
    const attributionHighlight = getAttributionHighlightString(spanKey, spanDisplayText, variant);

    return { spanReplacementRegex, attributionHighlight };
};

export const documentFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        let contentWithMarks = content;

        const selectedSpans = selectedCorrespondingSpansSelector(state);

        selectedSpans.forEach(([spanKey, span]) => {
            const { spanReplacementRegex, attributionHighlight } = formatSpan(
                'selected',
                spanKey,
                span?.text
            );

            if (spanReplacementRegex != null && attributionHighlight != null) {
                contentWithMarks = contentWithMarks.replaceAll(
                    spanReplacementRegex,
                    attributionHighlight
                );
            }
        });

        const previewSpans = previewCorrespondingSpansSelector(state);
        const previewSpansThatArentSelected = previewSpans.filter(
            (previewSpan) => !selectedSpans.includes(previewSpan)
        );

        previewSpansThatArentSelected.forEach(([spanKey, span]) => {
            const { spanReplacementRegex, attributionHighlight } = formatSpan(
                'preview',
                spanKey,
                span?.text
            );

            if (spanReplacementRegex != null && attributionHighlight != null) {
                contentWithMarks = contentWithMarks.replaceAll(
                    spanReplacementRegex,
                    attributionHighlight
                );
            }
        });

        return contentWithMarks;
    };
