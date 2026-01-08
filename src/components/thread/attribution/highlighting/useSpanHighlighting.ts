import { useMessage } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { AttributionSpan } from '@/components/thread/Markdown/rehype-attribution-highlights';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { removeMarkdownCharactersFromStartAndEndOfSpan } from './escape-markdown-in-span';

export const useSpanHighlighting = (messageId: string) => {
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);

    // this shouldn't happen
    const content = message?.content || '';

    const spans = useAppContext(
        (state) => state.attribution.attributionsByMessageId[messageId]?.spans ?? {}
    );

    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );

    const attributionSpans: AttributionSpan[] =
        isCorpusLinkEnabled && isMessageSelected
            ? Object.entries(spans)
                  .map(([spanKey, span]) => {
                      if (!span?.text) return null;
                      return {
                          spanKey,
                          span: {
                              ...span,
                              text: removeMarkdownCharactersFromStartAndEndOfSpan(span.text),
                          },
                      };
                  })
                  .filter((s): s is AttributionSpan => s !== null)
            : [];

    return { content, attributionSpans };
};
