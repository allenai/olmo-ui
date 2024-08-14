import { AppContextState } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

const selectedCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.selectedDocumentIndex == null) {
        return [];
    }

    const documents = messageAttributionsSelector(state)?.documents;
    return documents?.[state.attribution.selectedDocumentIndex]?.corresponding_spans ?? [];
};

const previewCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.previewDocumentIndex == null) {
        return [];
    }

    const documents = messageAttributionsSelector(state)?.documents;
    return documents?.[state.attribution.previewDocumentIndex]?.corresponding_spans ?? [];
};

export const markedContentSelector = (messageId: string) => (state: AppContextState) => {
    const content = state.selectedThreadMessagesById[messageId].content;

    let contentWithMarks = content;

    const selectedSpans = selectedCorrespondingSpansSelector(state);

    selectedSpans.forEach((span) => {
        // TODO: We're going to have potential issues here with nested spans, need to figure out how to fix that
        contentWithMarks = contentWithMarks.replaceAll(
            span,
            `:attribution-highlight[${span}]{variant="selected" span="${span}"}`
        );
    });

    const previewSpans = previewCorrespondingSpansSelector(state);
    const previewSpansThatArentSelected = previewSpans.filter(
        (previewSpan) => !selectedSpans.includes(previewSpan)
    );

    previewSpansThatArentSelected.forEach((span) => {
        contentWithMarks = contentWithMarks.replaceAll(
            span,
            `:attribution-highlight[${span}]{variant="preview" span=${span}}`
        );
    });

    return contentWithMarks;
};
