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
                <Video className={css({ borderRadius: 'sm' })} muted={true} src={videoUrl} />
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

    const fps = 24;
    const durationInFrames = 12 * fps;

    const width = 1460 / 2;
    const height = 864 / 2;

    return (
        <div>
            <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'start' })}>
                <PointSelect playerRef={playerRef} fps={fps}>
                    <Player
                        acknowledgeRemotionLicense
                        ref={playerRef}
                        component={MolmoVideoComposition}
                        inputProps={{ videoUrl, version, data: videoTracking }}
                        durationInFrames={durationInFrames}
                        compositionWidth={width}
                        compositionHeight={height}
                        fps={fps}
                        moveToBeginningWhenEnded={false}
                    />
                </PointSelect>
            </div>
            <SeekBar
                fps={fps}
                playerRef={playerRef}
                width={width}
                data={videoTracking}
                durationInFrames={durationInFrames}
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
    const { height, width, fps } = useVideoConfig();

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
                <div className={css({ position: 'absolute', top: '0', left: '0' })}>
                    <VideoSingleDotTrack key={id} trackId={id} object={object} />
                </div>
            ))}
        </div>
    );
};

export const VideoSingleDotTrack = ({
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
