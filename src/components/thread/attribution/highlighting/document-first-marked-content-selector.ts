import { AppContextState } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

const selectedCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.selectedDocumentIndex == null) {
        return [];
    }
    const message = messageAttributionsSelector(state);

    if (message == null) {
        return [];
    }

    const correspondingSpans =
        message.documents[state.attribution.selectedDocumentIndex]?.corresponding_spans ?? [];

    return correspondingSpans.map((correspondingSpan) => message.spans[correspondingSpan]);
};
const previewCorrespondingSpansSelector = (state: AppContextState) => {
    const message = messageAttributionsSelector(state);
    if (state.attribution.previewDocumentIndex == null || message == null) {
        return [];
    }

    const correspondingSpans =
        message.documents[state.attribution.previewDocumentIndex]?.corresponding_spans ?? [];

    return correspondingSpans.map((correspondingSpan) => message.spans[correspondingSpan]);
};

export const documentFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        let contentWithMarks = content;

        const selectedSpans = selectedCorrespondingSpansSelector(state);

        Object.entries(selectedSpans).forEach(([spanKey, span]) => {
            if (span?.text) {
                contentWithMarks = contentWithMarks.replaceAll(
                    createSpanReplacementRegex(span.text),
                    getAttributionHighlightString(spanKey, span.text, 'selected')
                );
            }
        });

        const previewSpans = previewCorrespondingSpansSelector(state);
        const previewSpansThatArentSelected = previewSpans.filter(
            (previewSpan) => !selectedSpans.includes(previewSpan)
        );

        Object.entries(previewSpansThatArentSelected).forEach(([spanKey, span]) => {
            if (span?.text) {
                contentWithMarks = contentWithMarks.replaceAll(
                    createSpanReplacementRegex(span.text),
                    getAttributionHighlightString(spanKey, span.text, 'preview')
                );
            }
        });

        return contentWithMarks;
    };
