import { Theme } from '@mui/material';

export const biggerContainerQuery = (theme: Theme) =>
    `@container (min-width: ${theme.breakpoints.values.md}px)`;

export const smallerContainerQuery = (theme: Theme) =>
    `@container (max-width: ${theme.breakpoints.values.md}px)`;

export const minContainerQuery = (theme: Theme, size: number) =>
    `@container (min-width: ${size}px)`;

export const maxContainerQuery = (theme: Theme, size: number) =>
    `@container (max-width: ${size}px)`;
