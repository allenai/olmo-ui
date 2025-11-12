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

import {
    PerFrameTrackPoints,
    TrackPoint,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

import { PointSelect } from './PointSelect';
import { SeekBar } from './time-line';

export const FPS = 30;

export const MolmoVideoComposition = ({
    fileName,
    version,
    data,
}: {
    fileName: string;
    version: string;
    data: VideoTrackingPoints;
}) => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>
                <AbsoluteFill>
                    <VideoTracking data={data} version={version} />
                </AbsoluteFill>
                <OffthreadVideo muted={true} src={staticFile(fileName)} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const MolmoVideo = ({
    version,
    videoTracking,
}: {
    version: string;
    videoTracking: VideoTrackingPoints;
}) => {
    const playerRef = useRef<PlayerRef>(null);
    const durationInFrames = 10 * FPS;

    return (
        <div>
            <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'start' })}>
                <PointSelect playerRef={playerRef}>
                    <Player
                        acknowledgeRemotionLicense
                        ref={playerRef}
                        component={MolmoVideoComposition}
                        inputProps={{ fileName: 'mclaren-track.MP4', version, data: videoTracking }}
                        durationInFrames={durationInFrames}
                        compositionWidth={1460 / 2}
                        compositionHeight={864 / 2}
                        fps={FPS}
                        controls
                    />
                </PointSelect>
            </div>
            <SeekBar
                durationInFrames={durationInFrames}
                playerRef={playerRef}
                width={400}
                data={videoTracking}
            />
        </div>
    );
};

export const VideoTracking = ({
    version,
    data,
}: {
    version: string;
    data: VideoTrackingPoints;
}) => {
    if (version === 'one') {
        return (
            <div>
                {data.frameList.map((object, i) => (
                    <VideoCountObjectBlinkComponent key={i} object={object} />
                ))}
            </div>
        );
    }
    if (version === 'two') {
        return (
            <div>
                {data.frameList.map((object, i) => (
                    <VideoCountObjectComponent key={i} object={object} />
                ))}
            </div>
        );
    }
    if (version === 'three') {
        return (
            <div>
                <VideoDotTrackObjectComponent object={data} />
            </div>
        );
    }
};

export const VideoCountObjectComponent = ({ object }: { object: PerFrameTrackPoints }) => {
    return (
        <div>
            <FramePointComponent framePoint={object} />
        </div>
    );
};

export const VideoCountObjectBlinkComponent = ({ object }: { object: PerFrameTrackPoints }) => {
    return (
        <div>
            <FramePointBlinkComponent framePoint={object} />
        </div>
    );
};

export const VideoDotTrackObjectComponent = ({ object }: { object: VideoTrackingPoints }) => {
    // TODO: Handle multiple tracks...
    const { height, width } = useVideoConfig();

    const { x, y, times } = useMemo(() => {
        const x = object.frameList.map((frame) => {
            return frame.tracks[0].x;
        });
        const y = object.frameList.map((frame) => {
            return frame.tracks[0].y;
        });
        const times = object.frameList.map((frame) => {
            return frame.timestamp * FPS;
        });
        return { x, y, times };
    }, [object]);

    const { sizeTimes, size } = useMemo(() => {
        // TODO Breaks if translating points closer that .15 seconds together
        const animation = object.frameList.flatMap((framePoints) => {
            const before = (framePoints.timestamp - preTimestampOffset) * FPS;
            const time = framePoints.timestamp * FPS;
            const after = (framePoints.timestamp + postTimestampOffset) * FPS;

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
                cy={`${yAnimated}%`}
                cx={`${xAnimated}%`}
                r={10}
                stroke="white"
                strokeWidth="3"
                fill={sizeAnimated > 0.5 ? varnishTheme.palette.primary.main : 'transparent'}
            />
        </svg>
    );
};

export const VideoDotTrailsTrackObjectComponent = ({ object }: { object: VideoTrackingPoints }) => {
    const { height, width } = useVideoConfig();

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
            const before = (framePoints.timestamp - preTimestampOffset) * FPS;
            const time = framePoints.timestamp * FPS;
            const after = (framePoints.timestamp + postTimestampOffset) * FPS;

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

const preTimestampOffset = 0.15;

const postTimestampOffset = 0.15;

export const FramePointComponent = ({ framePoint }: { framePoint: PerFrameTrackPoints }) => {
    const frame = useCurrentFrame();

    const pointShowStart = (framePoint.timestamp - preTimestampOffset) * FPS;
    const pointShowEnd = (framePoint.timestamp + postTimestampOffset) * FPS;

    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    const circleRadius = interpolate(
        frame,
        [pointShowStart, framePoint.timestamp * FPS, pointShowEnd],
        [0.5, 1, 0]
    );

    return (
        <>
            {framePoint.tracks.map((point, i) => (
                <SVGPoint key={i} point={point} circleRadius={circleRadius * 10} />
            ))}
        </>
    );
};

export const FramePointBlinkComponent = ({ framePoint }: { framePoint: PerFrameTrackPoints }) => {
    const frame = useCurrentFrame();

    const pointShowStart = (framePoint.timestamp - 0.05) * FPS;
    const pointShowEnd = (framePoint.timestamp + 0.05) * FPS;

    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    return (
        <>
            {framePoint.tracks.map((point, i) => (
                <SVGPoint key={i} point={point} circleRadius={10} />
            ))}
        </>
    );
};

const SVGPoint = ({ point, circleRadius = 10 }: { point: TrackPoint; circleRadius: number }) => {
    const { height, width } = useVideoConfig();

    return (
        <svg width={width} height={height}>
            <circle
                cy={`${point.y}%`}
                cx={`${point.x}%`}
                r={circleRadius}
                stroke="white"
                strokeWidth="3"
                fill={varnishTheme.palette.primary.main}
            />
        </svg>
    );
};
