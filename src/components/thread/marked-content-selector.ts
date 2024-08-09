import { AppContextState } from '@/AppContext';
import { documentsForMessageSelector } from '@/slices/AttributionSlice';

const selectedCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.selectedDocumentIndex == null) {
        return [];
    }

    const documents = documentsForMessageSelector(state);
    return documents[state.attribution.selectedDocumentIndex]?.corresponding_spans ?? [];
};

const previewCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.previewDocumentIndex == null) {
        return [];
    }

    const documents = documentsForMessageSelector(state);
    return documents[state.attribution.previewDocumentIndex]?.corresponding_spans ?? [];
};

export const markedContentSelector = (messageId: string) => (state: AppContextState) => {
    const content = state.selectedThreadMessagesById[messageId].content;

    let contentWithMarks = content;

    const selectedSpans = selectedCorrespondingSpansSelector(state);

    selectedSpans.forEach((span) => {
        contentWithMarks = contentWithMarks.replaceAll(
            span,
            `:attribution-highlight[${span}]{variant="selected"}`
        );
    });

    const previewSpans = previewCorrespondingSpansSelector(state);
    const previewSpansThatArentSelected = previewSpans.filter(
        (previewSpan) => !selectedSpans.includes(previewSpan)
    );

    previewSpansThatArentSelected.forEach((span) => {
        contentWithMarks = contentWithMarks.replaceAll(
            span,
            `:attribution-highlight[${span}]{variant="preview"}`
        );
    });

    return contentWithMarks;
};
