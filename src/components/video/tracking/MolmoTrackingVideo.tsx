import { css } from '@allenai/varnish-panda-runtime/css';
import { Checkbox } from '@allenai/varnish-ui';
import { Player, PlayerRef } from '@remotion/player';
import { useRef, useState } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { Controls } from '../controls/Controls';
import { useVideoMetaData } from '../useVideoMetaData';
import { FPS, MOVE_TO_BEGINNING_WHEN_ENDED } from '../videoConsts';
import { VideoTracking } from './Tracking';
import { Key } from 'react-aria-components';

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

    const handleSettings = (id: Key) => {
        if (id === 'toggle-interpolation') {
            setShowInterpolation(!showInterpolation);
        }
    };

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
                    initiallyMuted={true}
                    fps={FPS}
                    style={{ width: '100%', flex: '1' }}
                    moveToBeginningWhenEnded={MOVE_TO_BEGINNING_WHEN_ENDED}
                />
            </div>
            <Controls
                fps={FPS}
                playerRef={playerRef}
                data={videoTrackingPoints}
                durationInFrames={durationInFrames}
                frameStyle="line"
                onSettingsAction={handleSettings}
                settingsItems={[
                    {
                        id: 'toggle-interpolation',
                        label: showInterpolation ? 'Hide tween' : 'Show tween',
                    },
                ]}
            />
        </div>
    );
}
