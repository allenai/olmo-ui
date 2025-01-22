import { TopLevelAttributionSpan } from '@/api/AttributionClient';

import { createSpanReplacementRegex } from '../span-replacement-regex';
import { escapeBraces } from './escape-braces';
import { removeMarkdownCharactersFromStartAndEndOfSpan } from './escape-markdown-in-span';
import { getAttributionHighlightString } from './get-attribution-highlight-string';

export const addHighlightsToText = (
    initialText: string,
    spans: [spanKey: string, span: TopLevelAttributionSpan | undefined][]
) => {
    const textWithHighlights = spans.reduce((acc, [spanKey, span]) => {
        if (span?.text) {
            const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);
            const spanDisplayText = escapeBraces(escapedSpanText);

            return acc.replaceAll(
                createSpanReplacementRegex(escapedSpanText),
                getAttributionHighlightString(spanKey, spanDisplayText)
            );
        } else {
            return acc;
        }
    }, initialText);

    return textWithHighlights;
};
