import { useRef } from 'react';
import { PlayerRef } from '@remotion/player';
import { useCurrentPlayerFrame } from './use-current-player-frame';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { OffthreadVideo, staticFile } from 'remotion';
import {
    videoCountingExample,
    VideoTrackingPoints,
    VideoFramePoints,
    VideoTrackingObject,
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
                compositionWidth={500}
                compositionHeight={500}
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
    const frame = useCurrentFrame();
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

const preTimestampOffset = 0.25;

const postTimestampOffset = 0.25;

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

    return <div>hello</div>;
};
