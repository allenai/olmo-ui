import { escapeRegExp } from '@/utils/escape-reg-exp';

/**
 * @param spanToReplace
 * @returns A regex that will match spanToReplace as long as it isn't inside span="<value>"
 */
export const createSpanReplacementRegex = (spanToReplace: string) => {
    return new RegExp(
        `(?<!<attribution-highlight span="\\d*">)${escapeRegExp(spanToReplace)}(?!<\\/attribution-highlight>)`
    );
};
