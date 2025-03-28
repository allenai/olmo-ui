import { AppContextState } from '@/AppContext';

import { addHighlightsToText } from '../add-highlights-to-text';

export const markedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;
        const spans = state.attribution.attributionsByMessageId[messageId]?.spans ?? {};

        return addHighlightsToText(content, Object.entries(spans));
    };
