import { css } from '@allenai/varnish-panda-runtime/css';
import { memo, type ReactNode } from 'react';

import { useCurrentFrame } from './context/useCurrentFrame';
import { useTimeline } from './context/useTimeline';
import { formatTime } from './formatTime';

const timeDisplay = css({
    display: 'flex',
    lineHeight: '1.5',
    fontSize: 'sm',
    alignSelf: 'center',
});

interface TimeDisplayProps {
    decimalPlaces?: number;
}

export const TimeDisplay = memo(function TimeDisplay({
    decimalPlaces = 0,
}: TimeDisplayProps): ReactNode {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useTimeline();

    return (
        <div className={timeDisplay}>
            {formatTime(frame, fps, decimalPlaces)} /{` `}
            {formatTime(durationInFrames, fps, decimalPlaces)}
        </div>
    );
});
