// This regex is used to pull the text and span ID out of attribution highlight directives
// If you're using .match you can use .groups.spanText or .groups.spanId to get the respective values
export const attributionHighlightRegex =
    /:attribution-highlight\[(?<spanText>.*)\]{span="(?<spanId>.*)"}/gm;
