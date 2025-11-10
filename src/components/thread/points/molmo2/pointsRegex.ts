// This RegEx is global for String.replaceAll, when using it to match a single
// message contents, use String.search(pointRegex) !== -1 instead of pointRegex.test(string)
// as test will start at the last match for testing when using a global regex.
export const pointsRegex =
    /<points[\s\S]*?(?:coords=|tracks=)"(?:[^"]*)"[\s\S]*?>(?<text>[\s\S]*?)<\/points>/g;
