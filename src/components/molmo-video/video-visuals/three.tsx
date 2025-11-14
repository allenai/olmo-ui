import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

export const VideoDotTrackObjectComponent = ({ object }: { object: VideoTrackingPoints }) => {
    const objectIds = useMemo(() => {
        const ids: Record<string, boolean> = {};
        object.frameList.forEach((frame) => {
            frame.tracks.forEach((t) => (ids[t.trackId] = true));
        });
        return Object.keys(ids);
    }, [object]);

    return (
        <div className={css({ position: 'relative' })}>
            {objectIds.map((id) => (
                <div key={id} className={css({ position: 'absolute', top: '0', left: '0' })}>
                    <VideoSingleDotTrack key={id} trackId={id} object={object} />
                </div>
            ))}
        </div>
    );
};

const VideoSingleDotTrack = ({
    trackId,
    object,
}: {
    trackId: string;
    object: VideoTrackingPoints;
}) => {
    const { height, width, fps } = useVideoConfig();

    const { x, y, times } = useMemo(() => {
        const x = object.frameList.map((frame) => {
            return frame.tracks.find((t) => t.trackId === trackId)?.x || 0;
        });
        const y = object.frameList.map((frame) => {
            return frame.tracks.find((t) => t.trackId === trackId)?.y || 0;
        });
        const times = object.frameList.map((frame) => {
            return frame.timestamp * fps;
        });
        return { x, y, times };
    }, [object, fps, trackId]);

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
    }, [object, fps]);

    const frame = useCurrentFrame();

    const xAnimated = interpolate(frame, times, x);
    const yAnimated = interpolate(frame, times, y);
    const sizeAnimated = interpolate(frame, sizeTimes, size);

    if (frame < times[0] || frame > times[times.length - 1]) {
        return null;
    }

    return (
        <svg width={width} height={height}>
            <circle
                cy={`${yAnimated}%`}
                cx={`${xAnimated}%`}
                r={10}
                stroke={'white'}
                strokeWidth={2}
                fill={sizeAnimated > 0.5 ? varnishTheme.palette.primary.main : 'transparent'}
            />
        </svg>
    );
};
