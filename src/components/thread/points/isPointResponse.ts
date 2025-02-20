import { pointPattern, pointsPattern } from './pointRegex';

export const isPointResponse = (response: string): boolean =>
    pointsPattern.test(response) || pointPattern.test(response);
