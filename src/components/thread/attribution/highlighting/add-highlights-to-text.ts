import { TopLevelAttributionSpan } from '@/api/AttributionClient';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { removeMarkdownCharactersFromStartAndEndOfSpan } from './escape-markdown-in-span';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

export const addHighlightsToText = (
    initialText: string,
    spans: [spanKey: string, span: TopLevelAttributionSpan | undefined][]
) => {
    const textWithHighlights = spans.reduce((acc, [spanKey, span]) => {
        if (span?.text) {
            const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);

            return acc.replaceAll(
                createSpanReplacementRegex(escapedSpanText),
                getAttributionHighlightString(spanKey, escapedSpanText)
            );
        } else {
            return acc;
        }
    }, initialText);

    return textWithHighlights;
};
