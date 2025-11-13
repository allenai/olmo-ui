import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { Video } from '@remotion/media';
import { Player, PlayerRef } from '@remotion/player';
import { useMemo, useRef } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { PointSelect } from './PointSelect';
import { SeekBar } from './time-line';
import { VideoCountObjectBlinkComponent } from './video-visuals/one';
import { VideoCountObjectComponent } from './video-visuals/two';

export const FPS = 30;

export const MolmoVideoComposition = ({
    videoUrl,
    version,
    data,
}: {
    videoUrl: string;
    version: string;
    data: VideoTrackingPoints;
}) => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>
                <AbsoluteFill>
                    <VideoTracking data={data} version={version} />
                </AbsoluteFill>
                <Video muted={true} src={videoUrl} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

const preTimestampOffset = 0.15;

const postTimestampOffset = 0.15;

export const MolmoVideo = ({
    version,
    videoTracking,
    videoUrl,
}: {
    version: string;
    videoTracking: VideoTrackingPoints;
    videoUrl: string;
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
                        inputProps={{ videoUrl, version, data: videoTracking }}
                        durationInFrames={durationInFrames}
                        compositionWidth={1460 / 2}
                        compositionHeight={864 / 2}
                        fps={FPS}
                        controls
                        moveToBeginningWhenEnded={false}
                        spaceKeyToPlayOrPause
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
                fill={sizeAnimated > 0.5 ? varnishTheme.palette.primary.main : 'transparent'}
            />
        </svg>
    );
};
