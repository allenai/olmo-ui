import { pointRegex } from './pointRegex';
// Because this regex is used for String.replaceAll, it needs to be global.
// we need to use match here, because pointRegex is global, which means two tests in a row
// will produce different results, as the second one will test starting from the end of the previous
// match. String.search doesn't have this behavior.
export const hasPoints = (response: string): boolean => response.search(pointRegex) !== -1;
