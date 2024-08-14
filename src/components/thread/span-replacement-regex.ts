const bannedStringsInFront = ['span="'].join('|');
const bannedStringsBehind = ['"'].join('|');
/**
 * @param spanToReplace
 * @returns A regex that will match spanToReplace as long as it isn't preceded by strings in bannedStringsInFront and followed by strings in bannedStringsBehind
 */
export const createSpanReplacementRegex = (spanToReplace: string) => {
    // This regex uses negative lookbehind and negative lookahead
    // See the regex101 site for an explanation for this regex: https://regex101.com/r/rnbz3G
    return new RegExp(
        // String.raw is needed to prevent JS from escaping things automatically
        String.raw`(?<![${bannedStringsInFront}])${spanToReplace}(?![ws]*[${bannedStringsBehind}])`,
        'g'
    );
};
