import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
    PerFrameTrackPoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

import { VideoOverlayHelper } from '../VideoOverlayHelper';

export const VideoTracking = ({
    videoTrackingPoints,
    videoUrl,
    showInterpolation,
}: {
    videoUrl: string;
    videoTrackingPoints: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    return (
        <VideoOverlayHelper videoUrl={videoUrl}>
            <VideoDotTrackObjectComponent
                videoTrackingPoints={videoTrackingPoints}
                showInterpolation={showInterpolation}
            />
        </VideoOverlayHelper>
    );
};

export const VideoDotTrackObjectComponent = ({
    videoTrackingPoints,
    showInterpolation,
}: {
    videoTrackingPoints: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    const objectIds = useMemo(() => {
        const ids = videoTrackingPoints.frameList
            .flatMap((frame) => frame.tracks)
            .map((track) => track.trackId);
        return [...new Set(ids)];
    }, [videoTrackingPoints]);

    return (
        <div className={css({ position: 'relative' })}>
            {objectIds.map((id) => (
                <VideoSingleDotTrack
                    showInterpolation={showInterpolation}
                    key={id}
                    trackId={id}
                    videoTrackingPoints={videoTrackingPoints}
                />
            ))}
        </div>
    );
};

const PRE_TIMESTAMP_OFFSET = 0.15; // How long before the frame does the dot appear.
const POST_TIMESTAMP_OFFSET = 0.15; // How long after the frame does the dot linger.

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

    const filteredTracks = useMemo(() => {
        // filter down to the trackid
        return videoTrackingPoints.frameList.filter((frame: PerFrameTrackPoints) =>
            frame.tracks.find((t) => t.trackId === trackId)
        );
    }, [videoTrackingPoints, trackId]);

    const { x, y, times } = useMemo(() => {
        const x = filteredTracks.map((frame) => {
            return frame.tracks.find((t) => t.trackId === trackId)?.x || 0;
        });
        const y = filteredTracks.map((frame) => {
            return frame.tracks.find((t) => t.trackId === trackId)?.y || 0;
        });
        const times = filteredTracks.map((frame) => {
            return frame.timestamp * fps;
        });
        return { x, y, times };
    }, [fps, trackId, filteredTracks]);

    const { sizeTimes, size, onScreen } = useMemo(() => {
        const animation = filteredTracks.flatMap((framePoints, i) => {
            const before = (framePoints.timestamp - PRE_TIMESTAMP_OFFSET) * fps;
            const after = (framePoints.timestamp + POST_TIMESTAMP_OFFSET) * fps;
            const leavingScreen =
                i === filteredTracks.length - 1 ||
                filteredTracks[i + 1].timestamp > framePoints.timestamp + 0.5
                    ? 0
                    : 1;
            const enteringScreen =
                i === 0 || filteredTracks[i - 1].timestamp < framePoints.timestamp - 0.5 ? 0 : 1;
            return [
                [before, 0, enteringScreen],
                [before + 1, 1, 1],
                [after, 1, 1],
                [after + 1, 0, leavingScreen],
            ];
        });

        const result = {
            sizeTimes: animation.map((a) => a[0]),
            size: animation.map((a) => a[1]),
            onScreen: animation.map((a) => a[2]),
        };

        return result;
    }, [filteredTracks, fps]);

    const frame = useCurrentFrame();

    if (times.length < 2) {
        // If the clip is less than tracking interval there will only be one timestamp, which causes an error in interpolate
        return null;
    }

    const xAnimated = interpolate(frame, times, x);
    const yAnimated = interpolate(frame, times, y);
    const shouldShowPoint = interpolate(frame, sizeTimes, size);
    const onScreenValue = interpolate(frame, sizeTimes, onScreen);

    if (onScreenValue <= 0) {
        return null;
    }

    return (
        <svg
            className={css({ position: 'absolute', top: '0', left: '0' })}
            width={width}
            height={height}>
            <circle
                cy={`${yAnimated}%`}
                cx={`${xAnimated}%`}
                r={'1.5%'}
                stroke={showInterpolation || shouldShowPoint === 1 ? 'white' : 'transparent'}
                strokeWidth={'0.3%'}
                fill={shouldShowPoint === 1 ? varnishTheme.palette.primary.main : 'transparent'}
            />
        </svg>
    );
};
