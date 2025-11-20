import { css } from '@allenai/varnish-panda-runtime/css';
import { Checkbox } from '@allenai/varnish-ui';
import { Player, PlayerRef } from '@remotion/player';
import { useRef, useState } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from '../seekBar/SeekBar';
import { useVideoMetaData } from '../useVideoMetaData';
import { VideoTracking } from './Tracking';

const FPS = 24;

export function MolmoTrackingVideo({
    videoTrackingPoints,
    videoUrl,
}: {
    videoTrackingPoints: VideoTrackingPoints;
    videoUrl: string;
}) {
    const playerRef = useRef<PlayerRef>(null);

    const [showInterpolation, setShowInterpolation] = useState(true);

    const { durationInFrames, width, height } = useVideoMetaData(videoUrl, FPS);

    return (
        <div>
            <div
                className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    maxHeight: '[60vh]',
                })}>
                <Player
                    acknowledgeRemotionLicense
                    ref={playerRef}
                    component={VideoTracking}
                    inputProps={{
                        videoUrl,
                        videoTrackingPoints,
                        showInterpolation,
                    }}
                    durationInFrames={durationInFrames}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={FPS}
                    style={{ width: '100%', flex: '1' }}
                    moveToBeginningWhenEnded={false}
                />
            </div>
            <SeekBar
                fps={FPS}
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
                <span>Interpolation</span>
            </Checkbox>
        </div>
    );
}
