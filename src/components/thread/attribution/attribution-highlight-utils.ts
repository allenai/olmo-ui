import { escapeRegExp } from '@/utils/escape-reg-exp';

type AttributionHighlightString =
    `<attribution-highlight span="${string}">${string}</attribution-highlight>`;

export const getAttributionHighlightString = (
    spanKey: string,
    span: string
): AttributionHighlightString =>
    // If you update this make sure you update the regex below
    `<attribution-highlight span="${spanKey}">${span}</attribution-highlight>`;

/**
 * @param spanToReplace
 * @returns A regex that will match spanToReplace as long as it isn't inside span="<value>"
 */
export const createSpanReplacementRegex = (spanToReplace: string) => {
    return new RegExp(
        // Make sure this tracks the actual highlight string above
        // This uses a negative lookahead to make sure there's no highlights ahead of it in the text
        `${escapeRegExp(spanToReplace)}(?!(?:.*<\\/attribution-highlight))`
    );
};
