import { SxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

export interface MessageProps extends PropsWithChildren {
    messageId: string;
}

export const sharedMessageStyle = {
    wordBreak: 'break-word',
    gridColumn: '2 / -1',
} satisfies SxProps;
