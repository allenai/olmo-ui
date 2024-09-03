import { AppContextState } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

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
