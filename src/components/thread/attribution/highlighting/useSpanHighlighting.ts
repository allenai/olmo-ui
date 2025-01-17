import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { markedContentSelector } from './marked-content-selector';

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
