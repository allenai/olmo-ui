import { TopLevelAttributionSpan } from '@/api/AttributionClient';
import { AppContextState } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { addHighlightsToText } from './add-highlights-to-text';

const spansCorrespondingToDocumentSelector =
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

export const markedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;
        const selection = state.attribution.selection;

        // TODO: See if we can move the document vs span logic to the AttributionHighlight instead of doing it here
        switch (selection?.type) {
            case 'document': {
                // The user has selected a document. Show spans associated with it.
                const selectedSpans = spansCorrespondingToDocumentSelector(selection.documentIndex)(
                    state
                );
                const textWithSelectedHighlights = addHighlightsToText(
                    'selected',
                    content,
                    selectedSpans
                );

                return textWithSelectedHighlights;
            }
            case null:
            // deliberate fallthrough
            case 'span':
            default: {
                const spans = state.attribution.attributionsByMessageId[messageId]?.spans ?? {};

                return addHighlightsToText('default', content, Object.entries(spans));
            }
        }
    };
