import { css } from '@allenai/varnish-panda-runtime/css';
import { Video } from '@remotion/media';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AbsoluteFill } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { PointSelect } from './PointSelect';
import { SeekBar } from './time-line';
import { VideoCountObjectBlinkComponent } from './video-visuals/one';
import { VideoCountObjectComponent } from './video-visuals/two';

import { VideoDotTrackObjectComponent } from './video-visuals/three';

export const MolmoVideoWrapper = ({
    videoUrl,
    children,
}: {
    videoUrl: string;
    children: ReactNode;
}) => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>
                <AbsoluteFill>{children}</AbsoluteFill>
                <Video className={css({ borderRadius: 'sm' })} muted={true} src={videoUrl} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/**
 * Custom hook to calculate video duration in frames
 * @param videoUrl - URL of the video
 * @param fps - Frames per second
 * @returns Duration in frames, or null if not yet loaded
 */
const useVideoDuration = (videoUrl: string, fps: number): number => {
    const [durationInFrames, setDurationInFrames] = useState<number>(1);

    useEffect(() => {
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;

        const handleLoadedMetadata = () => {
            const durationInSeconds = videoElement.duration;
            const frames = Math.round(durationInSeconds * fps);
            setDurationInFrames(frames);
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.src = '';
        };
    }, [videoUrl, fps]);

    return durationInFrames;
};

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
    const durationInFrames = useVideoDuration(videoUrl, fps);

    const width = 1460 / 2;
    const height = 864 / 2;

    return (
        <div>
            <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'start' })}>
                <PointSelect playerRef={playerRef} fps={fps}>
                    <Player
                        acknowledgeRemotionLicense
                        ref={playerRef}
                        component={VideoTracking}
                        inputProps={{
                            videoUrl,
                            version,
                            data: videoTracking,
                            showInterpolation: false,
                        }}
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
    videoUrl,

    showInterpolation,
}: {
    version: string;
    videoUrl: string;
    data: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    if (version === 'one') {
        return (
            <MolmoVideoWrapper videoUrl={videoUrl}>
                {data.frameList.map((object, i) => (
                    <VideoCountObjectBlinkComponent key={i} object={object} />
                ))}
            </MolmoVideoWrapper>
        );
    }
    if (version === 'two') {
        return (
            <MolmoVideoWrapper videoUrl={videoUrl}>
                {data.frameList.map((object, i) => (
                    <VideoCountObjectComponent key={i} object={object} />
                ))}
            </MolmoVideoWrapper>
        );
    }
    if (version === 'three') {
        return (
            <MolmoVideoWrapper videoUrl={videoUrl}>
                <VideoDotTrackObjectComponent object={data} showInterpolation={showInterpolation} />
            </MolmoVideoWrapper>
        );
    }
};
