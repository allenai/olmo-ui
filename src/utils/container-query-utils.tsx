import { Theme } from '@mui/material';

// not smart enough to check if unit, just convert base number to `Zpx`
const addPxIfNumber = (size: number | string): string =>
    typeof size === 'number' ? `${size}px` : size;

export const biggerContainerQuery = (theme: Theme) =>
    `@container (min-width: ${theme.breakpoints.values.md}px)`;

export const smallerContainerQuery = (theme: Theme) =>
    `@container (max-width: ${theme.breakpoints.values.md}px)`;

export const minContainerQuery = (size: number | string) =>
    `@container (min-width: ${addPxIfNumber(size)})`;

export const maxContainerQuery = (size: number | string) =>
    `@container (max-width: ${addPxIfNumber(size)})`;
