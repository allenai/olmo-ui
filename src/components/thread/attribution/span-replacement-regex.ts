import { escapeRegExp } from '@/utils/escape-reg-exp';

/**
 * @param spanToReplace
 * @returns A regex that will match spanToReplace as long as it isn't inside span="<value>"
 */
export const createSpanReplacementRegex = (spanToReplace: string) => {
    // This regex uses a negative lookahead
    // See the regex101 site for an explanation for this regex: https://regex101.com/r/rnbz3G
    return new RegExp(`(?<!(?:span="))${escapeRegExp(spanToReplace)}`, 'g');
};
