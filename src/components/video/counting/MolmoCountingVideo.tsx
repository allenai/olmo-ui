import { css } from '@allenai/varnish-panda-runtime/css';
import { Player, type PlayerRef } from '@remotion/player';
import { type ReactNode, useRef } from 'react';

import type { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';

import { Controls, ControlsGroup, SplitControls } from '../controls/Controls';
import { FullScreenButton } from '../controls/FullScreenButton';
import { PlayPause } from '../controls/PlayPause';
import { SeekBar } from '../controls/SeekBar';
import { SeekNext } from '../controls/SeekNext';
import { SeekPrevious } from '../controls/SeekPrevious';
import { TimeDisplay } from '../controls/TimeDisplay';
import { VolumeControl } from '../controls/VolumeControl';
import { FilmStrip } from '../filmStrip/FilmStrip';
import { THUMBNAIL_HEIGHT } from '../filmStrip/filmStripConsts';
import { useVideoMetaData } from '../useVideoMetaData';
import { FPS, MOVE_TO_BEGINNING_WHEN_ENDED } from '../videoConsts';
import { VideoPlayerContainer, VideoPlayerWrapper } from '../VideoPlayerContainer';
import { FilmStripSkeleton, SeekBarSkeleton, VideoPlayerSkeleton } from '../VideoSkeleton';
import { VideoCounting } from './VideoCounting/VideoCounting';

interface MolmoCountingVideoProps {
    videoPoints: VideoFramePoints; // do we get multiple?
    videoUrl: string;
}

export const MolmoCountingVideo = ({
    videoPoints,
    videoUrl,
}: MolmoCountingVideoProps): ReactNode => {
    const playerRef = useRef<PlayerRef>(null);

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
                    component={VideoCounting}
                    inputProps={{
                        videoUrl,
                        videoPoints,
                    }}
                    durationInFrames={durationInFrames}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={FPS}
                    initiallyMuted={true}
                    className={css({
                        maxHeight: '[50dvh]',
                        borderTopRadius: 'sm',
                    })}
                    style={{ width: '100%', flex: 1 }}
                    moveToBeginningWhenEnded={MOVE_TO_BEGINNING_WHEN_ENDED}
                />
            </VideoPlayerContainer>
            <FilmStrip
                playerRef={playerRef}
                videoUrl={videoUrl}
                fps={FPS}
                videoPoints={videoPoints}
                width={width}
                height={height}
                thumbnailHeight={THUMBNAIL_HEIGHT}
            />
            <Controls
                playerRef={playerRef}
                framePoints={videoPoints}
                fps={FPS}
                durationInFrames={durationInFrames}>
                <SeekBar frameStyle="dot" />
                <SplitControls>
                    <ControlsGroup>
                        <SeekPrevious />
                        <PlayPause />
                        <SeekNext />
                    </ControlsGroup>
                    <ControlsGroup>
                        <TimeDisplay />
                        <VolumeControl />
                        <FullScreenButton />
                    </ControlsGroup>
                </SplitControls>
            </Controls>
        </VideoPlayerWrapper>
    );
};
