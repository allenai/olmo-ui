export const removeMarkdownCharactersFromStartAndEndOfSpan = (spanText: string): string => {
    /**
     * https://regex101.com/r/5S3uuh
     * This regex checks for markdown characters inside of spans
     * At the start of a string, it looks for things like headings (any number of #) and list symbols (-, +, *, or 1.).
     * At the start and end of a string it looks for markdown symbols that can wrap something. This includes things like emphasis (any number of *, any number of _) and code blocks (`)
     * We also trim after doing the regex matching to make sure there's spaces before and after the highlight as needed
     */
    return spanText.trim().replaceAll(/^(?:[+\->`]|#+|\d\.|\*+\s)+\s*|(?<!\s)(?:\*+|_+|`)$/gm, '');
};
