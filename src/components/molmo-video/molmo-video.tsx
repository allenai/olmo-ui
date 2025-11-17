import { css } from '@allenai/varnish-panda-runtime/css';
import { Video } from '@remotion/media';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useRef } from 'react';
import { AbsoluteFill } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { PointSelect } from './PointSelect';
import { SeekBar } from './time-line';
import { useVideoMetaData } from './useVideoDuration';
import { VideoCountObjectBlinkComponent } from './video-visuals/one';
import { VideoDotTrackObjectComponent } from './video-visuals/three';
import { VideoCountObjectComponent } from './video-visuals/two';
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
    const { durationInFrames, width, height } = useVideoMetaData(videoUrl, fps);

    // todo set aspect based on video.
    // scale to fit area...
    // pull size to calculate scrub size...
    //
    const scaleRatio = width / 700;

    return (
        <div>
            <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'start' })}>
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
                    durationInFrames={durationInFrames + 1}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={fps}
                    style={{ width: '100%', flex: '1' }}
                    moveToBeginningWhenEnded={false}
                />
            </div>
            <SeekBar
                fps={fps}
                playerRef={playerRef}
                width={700}
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
