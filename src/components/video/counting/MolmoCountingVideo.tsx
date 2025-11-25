import { Player, type PlayerRef } from '@remotion/player';
import { type ReactNode, useRef } from 'react';

import type { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';

import { Controls } from '../controls/Controls';
import { FilmStrip } from '../filmStrip/FilmStrip';
import { THUMBNAIL_HEIGHT } from '../filmStrip/filmStripConsts';
import { SeekBar } from '../seekBar/SeekBar';
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
                data={videoPoints}
                fps={FPS}
                durationInFrames={durationInFrames}
                frameStyle="dot"
            />
        </VideoPlayerWrapper>
    );
};
