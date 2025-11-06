import { useRef } from 'react';

import { varnishTheme } from '@allenai/varnish2/theme';
import { PlayerRef } from '@remotion/player';
import { useCurrentPlayerFrame } from './use-current-player-frame';
import { Player } from '@remotion/player';
import {
    OffthreadVideo,
    staticFile,
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
} from 'remotion';

import {
    videoCountingExample,
    VideoTrackingPoints,
    VideoFramePoints,
    VideoTrackingObject,
    Point,
} from './example';

const FPS = 30;

export const MyComposition = () => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>
                <AbsoluteFill>
                    <VideoTracking />
                </AbsoluteFill>

                <OffthreadVideo src={staticFile('video.mp4')} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const MolmoVideo: React.FC = () => {
    const playerRef = useRef<PlayerRef>(null);

    return (
        <>
            <Player
                ref={playerRef}
                component={MyComposition}
                durationInFrames={120}
                compositionWidth={1460 / 2}
                compositionHeight={864 / 2}
                fps={FPS}
                controls
            />
            <TimeDisplay playerRef={playerRef} />
        </>
    );
};

export const TimeDisplay: React.FC<{
    playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
    const frame = useCurrentPlayerFrame(playerRef);

    return <div>current frame: {frame}</div>;
};

export const VideoTracking: React.FC = () => {
    const data = videoCountingExample;

    return (
        <div>
            {data.objects.map((object) => (
                <VideoTrackingObjectComponent object={object} />
            ))}
        </div>
    );
};

export const VideoTrackingObjectComponent: React.FC<{
    object: VideoTrackingObject;
}> = ({ object }) => {
    return (
        <div>
            {object.framePoints.map((point) => (
                <FramePointComponent framePoint={point} />
            ))}
        </div>
    );
};

const preTimestampOffset = 0.05;

const postTimestampOffset = 0.75;

export const FramePointComponent: React.FC<{
    framePoint: VideoFramePoints;
}> = ({ framePoint }) => {
    const frame = useCurrentFrame();
    const time = frame / FPS;

    const pointShowStart = framePoint.frameTimestamp - preTimestampOffset;
    const pointShowEnd = framePoint.frameTimestamp + postTimestampOffset;

    if (time < pointShowStart || time > pointShowEnd) {
        return null;
    }

    const circleRadius = interpolate(
        time,
        [pointShowStart, framePoint.frameTimestamp, pointShowEnd],
        [0.5, 1, 0]
    );

    return (
        <>
            {framePoint.points.map((point) => (
                <SVGPoint point={point} circleRadius={circleRadius * 10} />
            ))}
        </>
    );
};

const SVGPoint: React.FC<{
    point: Point;
    circleRadius: number;
}> = ({ point, circleRadius = 10 }) => {
    const { height, width } = useVideoConfig();

    return (
        <svg width={width} height={height}>
            <circle
                cx={point.x * 100 + '%'}
                cy={point.y * 100 + '%'}
                r={circleRadius}
                stroke="white"
                strokeWidth="3"
                fill={varnishTheme.palette.primary.main}
            />
        </svg>
    );
};
