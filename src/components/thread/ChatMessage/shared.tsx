import type { SxProps } from '@mui/material';
import type { PropsWithChildren } from 'react';

export interface MessageProps extends PropsWithChildren {
    messageId: string;
}

export const sharedMessageStyle = {
    wordBreak: 'break-word',
    gridColumn: '2 / -1',
} satisfies SxProps;
