import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

export const VideoDotTrackObjectComponent = ({
    videoTrackingPoints,
    showInterpolation,
}: {
    videoTrackingPoints: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    const objectIds = useMemo(() => {
        const ids: Record<string, boolean> = {};
        videoTrackingPoints.frameList.forEach((frame) => {
            frame.tracks.forEach((t) => (ids[t.trackId] = true));
        });
        return Object.keys(ids);
    }, [videoTrackingPoints]);

    return (
        <div className={css({ position: 'relative' })}>
            {objectIds.map((id) => (
                <div key={id} className={css({ position: 'absolute', top: '0', left: '0' })}>
                    <VideoSingleDotTrack
                        showInterpolation={showInterpolation}
                        key={id}
                        trackId={id}
                        videoTrackingPoints={videoTrackingPoints}
                    />
                </div>
            ))}
        </div>
    );
};

const preTimestampOffset = 0.15;
const postTimestampOffset = 0.15;

const VideoSingleDotTrack = ({
    trackId,
    videoTrackingPoints,
    showInterpolation,
}: {
    trackId: string;
    videoTrackingPoints: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    const { height, width, fps } = useVideoConfig();

    const { x, y, times } = useMemo(() => {
        const x = videoTrackingPoints.frameList.map((frame) => {
            return frame.tracks.find((t) => t.trackId === trackId)?.x || 0;
        });
        const y = videoTrackingPoints.frameList.map((frame) => {
            return frame.tracks.find((t) => t.trackId === trackId)?.y || 0;
        });
        const times = videoTrackingPoints.frameList.map((frame) => {
            return frame.timestamp * fps;
        });
        return { x, y, times };
    }, [videoTrackingPoints, fps, trackId]);

    const { sizeTimes, size } = useMemo(() => {
        // TODO Breaks if translating points closer that .15 seconds together
        const animation = videoTrackingPoints.frameList.flatMap((framePoints) => {
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
    }, [videoTrackingPoints, fps]);

    const frame = useCurrentFrame();

    if (times.length < 2) {
        // If the clip is less than .5 seconds long there will only be one time, which causes an error in interpolate
        return null;
    }

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
                r={'1.5%'}
                stroke={showInterpolation ? 'white' : 'transparent'}
                strokeWidth={2}
                fill={sizeAnimated > 0.5 ? varnishTheme.palette.primary.main : 'transparent'}
            />
        </svg>
    );
};
