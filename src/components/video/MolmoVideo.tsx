import { css } from '@allenai/varnish-panda-runtime/css';
import { Video } from '@remotion/media';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useRef } from 'react';
import { AbsoluteFill } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from './timeLine/SeekBar';
import { VideoDotTrackObjectComponent } from './tracking/Tracking';
import { useVideoMetaData } from './useVideoMetaData';

export const MolmoVideo = ({
    version,
    videoTrackingPoints,
    videoUrl,
}: {
    version: 'tracking';
    videoTrackingPoints: VideoTrackingPoints;
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
                        videoTrackingPoints,
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
                data={videoTrackingPoints}
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
    videoTrackingPoints,
    videoUrl,
    showInterpolation,
}: {
    version: 'tracking' | 'pointing';
    videoUrl: string;
    videoTrackingPoints: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    if (version === 'tracking') {
        return (
            <MolmoVideoWrapper videoUrl={videoUrl}>
                <VideoDotTrackObjectComponent
                    videoTrackingPoints={videoTrackingPoints}
                    showInterpolation={showInterpolation}
                />
            </MolmoVideoWrapper>
        );
    }
};
