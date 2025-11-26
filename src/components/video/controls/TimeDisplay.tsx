import { css } from '@allenai/varnish-panda-runtime/css';
import { PlayerRef } from '@remotion/player';
import { type ReactNode, type RefObject, useEffect, useState } from 'react';

import { formatTime } from './formatTime';

const timeDisplay = css({
    display: 'flex',
    lineHeight: '1.5',
    fontSize: 'sm',
    alignSelf: 'center',
});

// from: https://www.remotion.dev/docs/player/custom-controls#time-display
interface TimeDisplayProps {
    playerRef: RefObject<PlayerRef | null>;
    durationInFrames: number;
    fps: number;
    decimalPlaces?: number;
}
export const TimeDisplay = ({
    playerRef,
    durationInFrames,
    fps,
    decimalPlaces = 0,
}: TimeDisplayProps): ReactNode => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const player = playerRef.current;
        if (!player) {
            return;
        }

        const onTimeUpdate = () => {
            setTime(player.getCurrentFrame());
        };

        player.addEventListener('frameupdate', onTimeUpdate);

        return () => {
            player.removeEventListener('frameupdate', onTimeUpdate);
        };
    }, [playerRef]);

    return (
        <div className={timeDisplay}>
            <span>
                {formatTime(time, fps, decimalPlaces)}/
                {formatTime(durationInFrames, fps, decimalPlaces)}
            </span>
        </div>
    );
};
