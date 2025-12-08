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
import { VideoPlayerContainer, VideoPlayerWrapper } from '../VideoPlayerContainer';
import { FilmStripSkeleton, SeekBarSkeleton, VideoPlayerSkeleton } from '../VideoSkeleton';
import { VideoTracking } from './Tracking';

export function MolmoTrackingVideo({
    videoTrackingPoints,
    videoUrl,
    suppressInterpolation,
}: {
    videoTrackingPoints: VideoTrackingPoints;
    videoUrl: string;
    suppressInterpolation?: boolean;
}) {
    const playerRef = useRef<PlayerRef>(null);

    const [showInterpolation, setShowInterpolation] = useState(!suppressInterpolation);

    const { durationInFrames, width, height, isLoading } = useVideoMetaData(videoUrl, FPS);
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (isLoading) {
        return (
            <VideoPlayerWrapper>
                <VideoPlayerContainer>
                    <VideoPlayerSkeleton />
                </VideoPlayerContainer>
                <FilmStripSkeleton />
                <SeekBarSkeleton />
            </VideoPlayerWrapper>
        );
    }

    const handleSettings = (id: Key) => {
        if (id === 'toggle-interpolation') {
            setShowInterpolation(!showInterpolation);
        }
    };

    return (
        <VideoPlayerWrapper>
            <VideoPlayerContainer>
                <Player
                    acknowledgeRemotionLicense
                    ref={playerRef}
                    component={VideoTracking}
                    inputProps={{
                        videoUrl,
                        videoTrackingPoints,
                        showInterpolation,
                        setIsFullScreen,
                    }}
                    durationInFrames={durationInFrames}
                    compositionWidth={width}
                    compositionHeight={height}
                    initiallyMuted={true}
                    fps={FPS}
                    style={{ width: '100%', flex: '1' }}
                    className={css({
                        maxHeight: '[50dvh]',
                        borderTopRadius: 'sm',
                    })}
                    moveToBeginningWhenEnded={MOVE_TO_BEGINNING_WHEN_ENDED}
                    controls={isFullScreen}
                />
            </VideoPlayerContainer>
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
                                    label: showInterpolation
                                        ? 'Hide point transitions'
                                        : 'Show point transitions',
                                },
                            ]}
                        />
                        <FullScreenButton onChange={setIsFullScreen} />
                    </ControlsGroup>
                </SplitControls>
            </Controls>
        </VideoPlayerWrapper>
    );
}
