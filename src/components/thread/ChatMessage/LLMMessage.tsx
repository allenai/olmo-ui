import { SxProps, Typography } from '@mui/material';
import { MouseEvent } from 'react';

import { useAppContext } from '@/AppContext';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { MessageProps, sharedMessageStyle } from './shared';

const streamingMessageIndicatorStyle = {
    // this assumes a response format like what's generated with react-markdown
    // we wrap with a Typography element then inside the Typography element is the actual message
    '&[data-is-streaming="true"] > * > :last-child::after': {
        borderRadius: 5,
        bgcolor: 'primary.main',
        content: '""',
        display: 'inline-block',
        height: '1em',
        width: '1em',
        position: 'relative',
        left: 3,
        top: 3,
    },
} satisfies SxProps;

export const LLMMessage = ({ messageId, children }: MessageProps): JSX.Element => {
    const { streamingMessageId } = useThreadView();
    const { remoteState } = useQueryContext();
    const shouldShowStreamingIndicator =
        streamingMessageId === messageId && remoteState === RemoteState.Loading;
    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (isMessageSelected) {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A') {
                e.preventDefault();
            }
        }
    };

    return (
        <Typography
            component="div"
            onClick={handleClick}
            paddingBlockEnd={2}
            sx={[sharedMessageStyle, streamingMessageIndicatorStyle]}
            data-is-streaming={shouldShowStreamingIndicator}>
            {children}
        </Typography>
    );
};
