import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { documentFirstMarkedContentSelector } from './document-first-marked-content-selector';
import { spanFirstMarkedContentSelector } from './span-first-marked-content-selector';

export const useSpanHighlighting = (messageId: string) => {
    const { attribution, attributionSpanFirst } = useFeatureToggles();

    const highlightSelector = attributionSpanFirst
        ? spanFirstMarkedContentSelector
        : documentFirstMarkedContentSelector;

    const contentWithMarks = useAppContext((state) => {
        if (!attribution) {
            return state.selectedThreadMessagesById[messageId].content;
        }

        return highlightSelector(messageId)(state);
    });

    return contentWithMarks;
};
