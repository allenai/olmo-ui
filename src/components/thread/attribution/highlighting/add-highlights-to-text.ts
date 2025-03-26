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

    let textWithReplacements = '';
    let textWithoutReplacements = initialText;

    spans.forEach(([spanKey, span]) => {
        if (span?.text) {
            const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);
            const highlight = getAttributionHighlightString(spanKey, escapedSpanText);

            const newReplacement = textWithoutReplacements.replace(
                createSpanReplacementRegex(escapedSpanText),
                highlight
            );
            const [beforeHighlight, afterHighlight] = newReplacement.split(highlight);
            textWithReplacements += beforeHighlight + highlight;
            textWithoutReplacements = afterHighlight;
        }
    });

    return textWithReplacements;

    // const textWithHighlights = spans.reduce((acc, [spanKey, span]) => {
    //     if (span?.text) {
    //         const escapedSpanText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);

    //         return acc.replace(
    //             createSpanReplacementRegex(escapedSpanText),
    //             getAttributionHighlightString(spanKey, escapedSpanText)
    //         );
    //     } else {
    //         return acc;
    //     }
    // }, initialText);

    // return textWithHighlights;
};
