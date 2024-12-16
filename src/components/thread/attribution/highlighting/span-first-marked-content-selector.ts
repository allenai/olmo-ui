import { AppContextState } from '@/AppContext';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { escapeBraces } from './escape-braces';
import { removeMarkdownCharactersFromStartAndEndOfSpan } from './escape-markdown-in-span';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

export const spanFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        const spans = state.attribution.attributionsByMessageId[messageId]?.spans ?? {};

        const intermediate = Object.entries(spans).reduce((acc, [spanKey, span]) => {
            if (span?.text) {
                const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);
                const spanDisplayText = escapeBraces(escapedSpanText);

                return acc.replaceAll(
                    createSpanReplacementRegex(escapedSpanText),
                    getAttributionHighlightString(spanKey, spanDisplayText, 'default')
                );
            } else {
                return acc;
            }
        }, content);
        return intermediate;
    };
