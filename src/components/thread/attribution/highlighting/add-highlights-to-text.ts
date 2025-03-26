import { TopLevelAttributionSpan } from '@/api/AttributionClient';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { removeMarkdownCharactersFromStartAndEndOfSpan } from './escape-markdown-in-span';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

// Replace first instance of span, get position
// acc += string including the highlight
//
export const addHighlightsToText = (
    initialText: string,
    spans: [spanKey: string, span: TopLevelAttributionSpan | undefined][]
) => {
    if (spans.length === 0) {
        return initialText;
    }

    const textWithHighlights = spans.reduce((acc, [spanKey, span]) => {
        if (span?.text) {
            const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);

            return acc.replace(
                createSpanReplacementRegex(escapedSpanText),
                getAttributionHighlightString(spanKey, escapedSpanText)
            );
        } else {
            return acc;
        }
    }, initialText);

    return textWithHighlights;
};
