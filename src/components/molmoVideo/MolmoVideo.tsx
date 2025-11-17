import { css } from '@allenai/varnish-panda-runtime/css';
import { Video } from '@remotion/media';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useRef } from 'react';
import { AbsoluteFill } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from './SeekBar';
import { useVideoMetaData } from './useVideoDuration';
import { VideoDotTrackObjectComponent } from './video-visuals/Tracking';

export const MolmoVideo = ({
    version,
    videoTracking,
    videoUrl,
}: {
    version: 'tracking';
    videoTracking: VideoTrackingPoints;
    videoUrl: string;
}) => {
    const playerRef = useRef<PlayerRef>(null);

    const fps = 24;
    const { durationInFrames, width, height } = useVideoMetaData(videoUrl, fps);

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
                data={videoTracking}
                durationInFrames={durationInFrames}
            />
        </div>
    );
};

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

export const VideoTracking = ({
    version,
    data,
    videoUrl,

    showInterpolation,
}: {
    version: 'tracking' | 'pointing';
    videoUrl: string;
    data: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    if (version === 'tracking') {
        return (
            <MolmoVideoWrapper videoUrl={videoUrl}>
                <VideoDotTrackObjectComponent object={data} showInterpolation={showInterpolation} />
            </MolmoVideoWrapper>
        );
    }
};
