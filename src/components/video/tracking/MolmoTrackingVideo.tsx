import { css } from '@allenai/varnish-panda-runtime/css';
import { Player, PlayerRef } from '@remotion/player';
import { useRef, useState } from 'react';
import { Key } from 'react-aria-components';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { Controls, ControlsGroup, SplitControls } from '../controls/Controls';
import { FullScreenButton } from '../controls/FullScreenButton';
import { PlayPause } from '../controls/PlayPause';
import { SeekBar } from '../controls/SeekBar';
import { SeekNext } from '../controls/SeekNext';
import { SeekPrevious } from '../controls/SeekPrevious';
import { SettingsControl } from '../controls/SettingsControl';
import { TimeDisplay } from '../controls/TimeDisplay';
import { VolumeControl } from '../controls/VolumeControl';
import { useVideoMetaData } from '../useVideoMetaData';
import { FPS, MOVE_TO_BEGINNING_WHEN_ENDED } from '../videoConsts';
import { VideoTracking } from './Tracking';

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
                playerRef={playerRef}
                framePoints={videoTrackingPoints}
                fps={FPS}
                durationInFrames={durationInFrames}>
                <SeekBar frameStyle="line" />
                <SplitControls>
                    <ControlsGroup>
                        <SeekPrevious />
                        <PlayPause />
                        <SeekNext />
                    </ControlsGroup>
                    <ControlsGroup>
                        <TimeDisplay />
                        <VolumeControl />
                        <SettingsControl
                            onAction={handleSettings}
                            menuItems={[
                                {
                                    id: 'toggle-interpolation',
                                    label: showInterpolation ? 'Hide tween' : 'Show tween',
                                },
                            ]}
                        />
                        <FullScreenButton />
                    </ControlsGroup>
                </SplitControls>
            </Controls>
        </div>
    );
}
