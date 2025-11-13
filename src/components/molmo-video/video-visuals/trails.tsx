import { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

const preTimestampOffset = 0.15;

const postTimestampOffset = 0.15;

export const VideoDotTrailsTrackObjectComponent = ({ object }: { object: VideoTrackingPoints }) => {
    const { height, width, fps } = useVideoConfig();

    // TODO: Handle multiple tracks...

    const { x, y, times } = useMemo(() => {
        const x = object.frameList.map((framePoints) => {
            return framePoints.tracks[0].x;
        });
        const y = object.frameList.map((framePoints) => {
            return framePoints.tracks[0].y;
        });
        const times = object.frameList.map((framePoints) => {
            return framePoints.timestamp;
        });
        return { x, y, times };
    }, [object]);

    const { sizeTimes, size } = useMemo(() => {
        // TODO Breaks if translating points closer that .15 seconds together
        const animation = object.frameList.flatMap((framePoints) => {
            const before = (framePoints.timestamp - preTimestampOffset) * fps;
            const time = framePoints.timestamp * fps;
            const after = (framePoints.timestamp + postTimestampOffset) * fps;

            return [
                [before, 0],
                [time, 1],
                [after, 0],
            ];
        });

        const result = { sizeTimes: animation.map((a) => a[0]), size: animation.map((a) => a[1]) };

        return result;
    }, [object]);

    const frame = useCurrentFrame();

    // const xAnimated = interpolate(frame, times, x);
    // const yAnimated = interpolate(frame, times, y);
    // const sizeAnimated = interpolate(frame, sizeTimes, size);

    return (
        <svg width={width} height={height} viewBox="0 0 100 100">
            <path
                d="M 0 0 L 10 0 L 100 0"
                stroke="red"
                strokeWidth="3"
                fill="none"
                pathLength="100"
                style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 100,
                }}
            />
        </svg>
    );
};
