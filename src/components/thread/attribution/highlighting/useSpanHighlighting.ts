import { getMessageFromCache } from '@/api/playgroundApi/message';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { addHighlightsToText } from './add-highlights-to-text';
import { markedContentSelector } from './marked-content-selector';

// remove in favor of the query based
export const useSpanHighlighting = (messageId: string) => {
    const { isCorpusLinkEnabled } = useFeatureToggles();

    const highlightSelector = markedContentSelector;

    const contentWithMarks = useAppContext((state) => {
        if (!isCorpusLinkEnabled || state.attribution.selectedMessageId !== messageId) {
            return state.selectedThreadMessagesById[messageId].content;
        }

        return highlightSelector(messageId)(state);
    });

    return contentWithMarks;
};

export const useSpanHighlightingQuery = (threadId: string, messageId: string) => {
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const spans = useAppContext(
        (state) => state.attribution.attributionsByMessageId[messageId]?.spans ?? {}
    );

    const { content } = getMessageFromCache(threadId, messageId);

    if (isCorpusLinkEnabled) {
        return addHighlightsToText(content, Object.entries(spans));
    } else {
        return content;
    }
};
