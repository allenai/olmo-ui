import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { Player, PlayerRef } from '@remotion/player';
import { useMemo, useRef } from 'react';
import {
    AbsoluteFill,
    interpolate,
    OffthreadVideo,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

import { PlayPauseButton } from './controls';
import { mclarenTrack, Point, VideoFramePoints, VideoTrackingObject } from './example';
import { PointSelect } from './PointSelect';
import { useCurrentPlayerFrame } from './use-current-player-frame';

export const FPS = 30;

export const MyComposition = ({ fileName, version }: { fileName: string; version: string }) => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>
                <AbsoluteFill>
                    <VideoTracking version={version} />
                </AbsoluteFill>

                <OffthreadVideo muted={true} src={staticFile(fileName)} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const MolmoVideo = ({ version }: { version: string }) => {
    const playerRef = useRef<PlayerRef>(null);

    return (
        <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'start' })}>
            <PointSelect playerRef={playerRef}>
                <Player
                    acknowledgeRemotionLicense
                    ref={playerRef}
                    component={MyComposition}
                    inputProps={{ fileName: 'mclaren-track.MP4', version }}
                    durationInFrames={10 * FPS}
                    compositionWidth={1460 / 2}
                    compositionHeight={864 / 2}
                    fps={FPS}
                />
            </PointSelect>
            <PlayPauseButton playerRef={playerRef} />
            <TimeDisplay playerRef={playerRef} />
        </div>
    );
};

export const TimeDisplay = ({ playerRef }: { playerRef: React.RefObject<PlayerRef | null> }) => {
    const frame = useCurrentPlayerFrame(playerRef);

    return (
        <div>
            current frame: {frame} time: {frame / FPS}
        </div>
    );
};

export const VideoTracking = ({ version }: { version: string }) => {
    const data = mclarenTrack;

    if (version === 'one') {
        return (
            <div>
                {data.objects.map((object, i) => (
                    <VideoCountObjectBlinkComponent key={i} object={object} />
                ))}
            </div>
        );
    }
    if (version === 'two') {
        return (
            <div>
                {data.objects.map((object, i) => (
                    <VideoCountObjectComponent key={i} object={object} />
                ))}
            </div>
        );
    }
    if (version === 'three') {
        return (
            <div>
                {data.objects.map((object, i) => (
                    <VideoDotTrackObjectComponent key={i} object={object} />
                ))}
            </div>
        );
    }
};

export const VideoCountObjectComponent = ({ object }: { object: VideoTrackingObject }) => {
    return (
        <div>
            {object.framePoints.map((point, i) => (
                <FramePointComponent key={i} framePoint={point} />
            ))}
        </div>
    );
};

export const VideoCountObjectBlinkComponent = ({ object }: { object: VideoTrackingObject }) => {
    return (
        <div>
            {object.framePoints.map((point, i) => (
                <FramePointBlinkComponent key={i} framePoint={point} />
            ))}
        </div>
    );
};

export const VideoDotTrackObjectComponent = ({ object }: { object: VideoTrackingObject }) => {
    const { height, width } = useVideoConfig();

    const { x, y, times } = useMemo(() => {
        const x = object.framePoints.map((framePoints) => {
            return framePoints.points[0].x;
        });
        const y = object.framePoints.map((framePoints) => {
            return framePoints.points[0].y;
        });
        const times = object.framePoints.map((framePoints) => {
            return framePoints.frameTimestamp * FPS;
        });
        return { x, y, times };
    }, [object]);

    const { sizeTimes, size } = useMemo(() => {
        // TODO Breaks if translating points closer that .15 seconds together
        const animation = object.framePoints.flatMap((framePoints) => {
            const before = (framePoints.frameTimestamp - preTimestampOffset) * FPS;
            const time = framePoints.frameTimestamp * FPS;
            const after = (framePoints.frameTimestamp + postTimestampOffset) * FPS;

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

    const xAnimated = interpolate(frame, times, x);
    const yAnimated = interpolate(frame, times, y);
    const sizeAnimated = interpolate(frame, sizeTimes, size);

    return (
        <svg width={width} height={height}>
            <circle
                cy={`${yAnimated * 100}%`}
                cx={`${xAnimated * 100}%`}
                r={10}
                stroke="white"
                strokeWidth="3"
                fill={sizeAnimated > 0.5 ? varnishTheme.palette.primary.main : 'transparent'}
            />
        </svg>
    );
};

export const VideoDotTrailsTrackObjectComponent = ({ object }: { object: VideoTrackingObject }) => {
    const { height, width } = useVideoConfig();

    const { x, y, times } = useMemo(() => {
        const x = object.framePoints.map((framePoints) => {
            return framePoints.points[0].x;
        });
        const y = object.framePoints.map((framePoints) => {
            return framePoints.points[0].y;
        });
        const times = object.framePoints.map((framePoints) => {
            return framePoints.frameTimestamp * FPS;
        });
        return { x, y, times };
    }, [object]);

    const { sizeTimes, size } = useMemo(() => {
        // TODO Breaks if translating points closer that .15 seconds together
        const animation = object.framePoints.flatMap((framePoints) => {
            const before = (framePoints.frameTimestamp - preTimestampOffset) * FPS;
            const time = framePoints.frameTimestamp * FPS;
            const after = (framePoints.frameTimestamp + postTimestampOffset) * FPS;

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

    const xAnimated = interpolate(frame, times, x);
    const yAnimated = interpolate(frame, times, y);
    const sizeAnimated = interpolate(frame, sizeTimes, size);

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

const preTimestampOffset = 0.15;

const postTimestampOffset = 0.35;

export const FramePointComponent = ({ framePoint }: { framePoint: VideoFramePoints }) => {
    const frame = useCurrentFrame();

    const pointShowStart = (framePoint.frameTimestamp - preTimestampOffset) * FPS;
    const pointShowEnd = (framePoint.frameTimestamp + postTimestampOffset) * FPS;

    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    const circleRadius = interpolate(
        frame,
        [pointShowStart, framePoint.frameTimestamp * FPS, pointShowEnd],
        [0.5, 1, 0]
    );

    return (
        <>
            {framePoint.points.map((point, i) => (
                <SVGPoint key={i} point={point} circleRadius={circleRadius * 10} />
            ))}
        </>
    );
};

export const FramePointBlinkComponent = ({ framePoint }: { framePoint: VideoFramePoints }) => {
    const frame = useCurrentFrame();

    const pointShowStart = (framePoint.frameTimestamp - 0.05) * FPS;
    const pointShowEnd = (framePoint.frameTimestamp + 0.05) * FPS;

    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    return (
        <>
            {framePoint.points.map((point, i) => (
                <SVGPoint key={i} point={point} circleRadius={10} />
            ))}
        </>
    );
};

const SVGPoint = ({ point, circleRadius = 10 }: { point: Point; circleRadius: number }) => {
    const { height, width } = useVideoConfig();

    return (
        <svg width={width} height={height}>
            <circle
                cy={`${point.y * 100}%`}
                cx={`${point.x * 100}%`}
                r={circleRadius}
                stroke="white"
                strokeWidth="3"
                fill={varnishTheme.palette.primary.main}
            />
        </svg>
    );
};
