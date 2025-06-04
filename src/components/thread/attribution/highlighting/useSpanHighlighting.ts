import { selectMessageById, useCurrentThreadMessage } from '@/api/playgroundApi/message';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { addHighlightsToText } from './add-highlights-to-text';

export const useSpanHighlighting = (messageId: string) => {
    const { isCorpusLinkEnabled } = useFeatureToggles();

    const spans = useAppContext(
        (state) => state.attribution.attributionsByMessageId[messageId]?.spans ?? {}
    );

    const { content } = useCurrentThreadMessage(selectMessageById(messageId));

    const contentWithMarks = useAppContext((state) => {
        if (!isCorpusLinkEnabled || state.attribution.selectedMessageId !== messageId) {
            return content;
        }

        return addHighlightsToText(content, Object.entries(spans));
    });

    return contentWithMarks;
};
