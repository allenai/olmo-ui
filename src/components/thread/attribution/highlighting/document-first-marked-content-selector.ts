import { TopLevelAttributionSpan } from '@/api/AttributionClient';
import { AppContextState } from '@/AppContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { addHighlightsToText } from './add-highlights-to-text';

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

export const documentFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        const selectedSpans = correspondingSpansSelector(state.attribution.selectedDocumentIndex)(
            state
        );
        const textWithSelectedHighlights = addHighlightsToText('selected', content, selectedSpans);

        const allPreviewSpans = correspondingSpansSelector(state.attribution.previewDocumentIndex)(
            state
        );
        const nonSelectedPreviewSpans = allPreviewSpans.filter(
            (previewSpan) =>
                !selectedSpans.some(([selectedSpanId, _]) => selectedSpanId === previewSpan[0])
        );
        const textWithPreviewHighlights = addHighlightsToText(
            'preview',
            textWithSelectedHighlights,
            nonSelectedPreviewSpans
        );

        return textWithPreviewHighlights;
    };
