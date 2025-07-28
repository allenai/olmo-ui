import { selectMessageById, useThread } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { addHighlightsToText } from './add-highlights-to-text';

export const useSpanHighlighting = (messageId: string) => {
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const { threadId } = useThreadView();
    const { data, error: _error } = useThread(threadId, {
        select: selectMessageById(messageId),
        staleTime: Infinity,
    });

    // this shouldn't happen
    const content = data?.content || '';

    const spans = useAppContext(
        (state) => state.attribution.attributionsByMessageId[messageId]?.spans ?? {}
    );

    const contentWithMarks = useAppContext((state) => {
        if (!isCorpusLinkEnabled || state.attribution.selectedMessageId !== messageId) {
            return content;
        }

        return addHighlightsToText(content, Object.entries(spans));
    });

    return contentWithMarks;
};
