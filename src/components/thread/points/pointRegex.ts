// This RegEx is global for String.replaceAll, when using it to match a single
// message contents, use String.search(pointRegex) !== -1 instead of pointRegex.test(string)
// as test will start at the last match for testing when using a global regex.
export const pointRegex =
    /<points?(?:\s+x\d?="\d+\.?\d*"\s+y\d?="\d+\.?\d*")+.*>(?<text>.*)<\/points?>/g;
