import { css } from '@allenai/varnish-panda-runtime/css';
import { Checkbox } from '@allenai/varnish-ui';
import { Player, PlayerRef } from '@remotion/player';
import { useRef, useState } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from './timeLine/SeekBar';
import { VideoDotTrackObjectComponent } from './tracking/Tracking';
import { useVideoMetaData } from './useVideoMetaData';
import { VideoOverlayHelper } from './VideoOverlayHelper';

export function MolmoTrackingVideo({
    videoTrackingPoints,
    videoUrl,
}: {
    videoTrackingPoints: VideoTrackingPoints;
    videoUrl: string;
}) {
    const playerRef = useRef<PlayerRef>(null);

    const [showInterpolation, setShowInterpolation] = useState(true);

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
                        videoTrackingPoints,
                        showInterpolation,
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
            <Checkbox
                isSelected={showInterpolation}
                onChange={(isChecked) => {
                    setShowInterpolation(isChecked);
                }}
                aria-label={`Toggle Interpolation between tracking points`}
                className={css({ paddingTop: '1' })}>
                <span>Show Interpolation</span>
            </Checkbox>
        </div>
    );
}

const VideoTracking = ({
    videoTrackingPoints,
    videoUrl,
    showInterpolation,
}: {
    videoUrl: string;
    videoTrackingPoints: VideoTrackingPoints;
    showInterpolation: boolean;
}) => {
    return (
        <VideoOverlayHelper videoUrl={videoUrl}>
            <VideoDotTrackObjectComponent
                videoTrackingPoints={videoTrackingPoints}
                showInterpolation={showInterpolation}
            />
        </VideoOverlayHelper>
    );
};
