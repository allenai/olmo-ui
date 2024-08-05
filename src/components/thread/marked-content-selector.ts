import { AppContextState } from '@/AppContext';

export const markedContentSelector = (messageId: string) => (state: AppContextState) => {
    const content = state.selectedThreadMessagesById[messageId].content;

    if (state.attribution.selectedDocumentIndex == null) {
        return content;
    }

    const spans =
        state.attribution.documents[state.attribution.selectedDocumentIndex].corresponding_spans;

    let contentWithMarks = content;
    spans.forEach((span) => {
        contentWithMarks = contentWithMarks.replaceAll(
            span,
            `:attribution-highlight[${span}]{variant="selected"}`
        );
    });

    return contentWithMarks;
};
