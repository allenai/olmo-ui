import { Theme } from '@mui/material';

export const biggerContainerQuery = (theme: Theme) =>
    `@container (min-width: ${theme.breakpoints.values.md}px)`;

export const smallerContainerQuery = (theme: Theme) =>
    `@container (max-width: ${theme.breakpoints.values.md}px)`;

export const smallViewportQuery = (theme: Theme) =>
    `@media only screen and (max-width: ${theme.breakpoints.values.sm}px)`;
