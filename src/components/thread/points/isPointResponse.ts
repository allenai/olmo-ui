import { pointRegex } from './pointRegex';

export const hasPoints = (response: string): boolean => pointRegex.test(response);
