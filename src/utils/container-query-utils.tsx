// not smart enough to check if unit, just convert base number to `Zpx`
const addPxIfNumber = (size: number | string): string =>
    typeof size === 'number' ? `${size}px` : size;

export const minContainerQuery = (size: number | string) =>
    `@container (min-width: ${addPxIfNumber(size)})`;

export const maxContainerQuery = (size: number | string) =>
    `@container (max-width: ${addPxIfNumber(size)})`;
