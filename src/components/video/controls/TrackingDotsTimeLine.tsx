import { css } from '@allenai/varnish-panda-runtime/css';
import { useMemo } from 'react';

import type {
    VideoFramePoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

export const TrackingDotsTimeline = ({
    data,
    durationInFrames,
    fps,
    frameClassName,
}: {
    data: VideoTrackingPoints | VideoFramePoints;
    durationInFrames: number;
    fps: number;
    frameClassName?: string;
}) => {
    const dots = useMemo(() => {
        return data.frameList.map((frame) => {
            return (frame.timestamp / ((durationInFrames - 1) / fps)) * 100;
        });
    }, [data, durationInFrames, fps]);

    return (
        <>
            {dots.map((leftOffset, index) => {
                return (
                    <div
                        key={index}
                        className={frameClassName}
                        style={{ left: `calc(${leftOffset}% - var(--tracking_dot_size)/2)` }}
                    />
                );
            })}
        </>
    );
};
