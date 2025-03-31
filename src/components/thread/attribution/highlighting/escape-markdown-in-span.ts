export const removeMarkdownCharactersFromStartAndEndOfSpan = (spanText: string): string => {
    /**
     * https://regex101.com/r/5S3uuh
     * This regex checks for markdown characters inside of spans
     * At the start of a string, it looks for things like headings (any number of #) and list symbols (-, +, *, or 1.) with a space after them.
     */
    return spanText.trim().replaceAll(/^(?:[+\->`]|#+|\d\.|\*+\s)+\s*|(?<!\s)(?:`)$/gm, '');
};
