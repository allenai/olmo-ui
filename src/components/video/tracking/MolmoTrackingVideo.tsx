import { css } from '@allenai/varnish-panda-runtime/css';
import { Checkbox } from '@allenai/varnish-ui';
import { Player, PlayerRef } from '@remotion/player';
import { useRef, useState } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from '../seekBar/SeekBar';
import { useVideoMetaData } from '../useVideoMetaData';
import { FPS, MOVE_TO_BEGINNING_WHEN_ENDED } from '../videoConsts';
import { VideoPlayerContainer, VideoPlayerWrapper } from '../VideoPlayerContainer';
import { FilmStripSkeleton, SeekBarSkeleton, VideoPlayerSkeleton } from '../VideoSkeleton';
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

    const { durationInFrames, width, height, isLoading } = useVideoMetaData(videoUrl, FPS);

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
                    }}
                    durationInFrames={durationInFrames}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={FPS}
                    style={{ width: '100%', flex: '1' }}
                    moveToBeginningWhenEnded={MOVE_TO_BEGINNING_WHEN_ENDED}
                />
            </VideoPlayerContainer>
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
        </VideoPlayerWrapper>
    );
}
