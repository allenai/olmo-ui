import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { Player, PlayerRef } from '@remotion/player';
import { useRef } from 'react';

import type { SchemaMolmo2PointPart } from '@/api/playgroundApi/playgroundApiSchema';
import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { Controls, ControlsGroup, SplitControls } from '../controls/Controls';
import { PlayPause } from '../controls/PlayPause';
import { SeekBar } from '../controls/SeekBar';
import { SeekNext } from '../controls/SeekNext';
import { SeekPrevious } from '../controls/SeekPrevious';
import { TimeDisplay } from '../controls/TimeDisplay';
import { VolumeControl } from '../controls/VolumeControl';
import { useVideoMetaData } from '../useVideoMetaData';
import { FPS } from '../videoConsts';
import { VideoOverlayHelper } from '../VideoOverlayHelper';
import { VideoPlayerWrapper } from '../VideoPlayerContainer';
import { SeekBarSkeleton, VideoPlayerSkeleton } from '../VideoSkeleton';
import { VideoDotControl } from './VideoDotControl';

export function VideoPointingInput({
    videoUrl,
    onRemoveFile,
    userPoint,
    setUserPoint,
}: {
    videoUrl: string | null;
    onRemoveFile: () => void;
    userPoint: SchemaMolmo2PointPart | null;
    setUserPoint: (value: SchemaMolmo2PointPart | null) => void;
}) {
    const playerRef = useRef<PlayerRef>(null);

    const { durationInFrames, width, height, isLoading } = useVideoMetaData(videoUrl, FPS);

    if (isLoading || videoUrl === null) {
        return (
            <VideoPlayerWrapper>
                <div
                    className={cx(
                        dotControlWrapper,
                        css({
                            aspectRatio: 16 / 9,
                            visibility: 'visible',
                        })
                    )}>
                    <VideoPlayerSkeleton />
                </div>
                <SeekBarSkeleton />
            </VideoPlayerWrapper>
        );
    }

    const mapPointToData = (userPoint: SchemaMolmo2PointPart | null) => {
        // TODO refactor seekbar to generic type
        const point: VideoTrackingPoints = {
            label: '1',
            type: 'track-points',
            frameList: userPoint
                ? [
                      {
                          timestamp: userPoint.time,
                          tracks: [
                              {
                                  x: userPoint.x,
                                  trackId: '1',
                                  y: userPoint.y,
                              },
                          ],
                      },
                  ]
                : [],
        };
        return point;
    };

    const isLandscape = width >= height;

    return (
        <VideoPlayerWrapper className={pointingVideoWrapper}>
            <div
                className={cx(
                    dotControlWrapper,
                    css({
                        aspectRatio: 16 / 9,
                        visibility: 'visible',
                    })
                )}>
                <VideoDotControl
                    playerRef={playerRef}
                    onRemoveFile={onRemoveFile}
                    userPoint={userPoint}
                    fps={FPS}
                    className={css({ alignSelf: 'center' })}
                    style={{
                        width: isLandscape ? '100%' : 'fit-content',
                        height: isLandscape ? 'fit-content' : '100%',
                    }}
                    onPointSelect={setUserPoint}>
                    <Player
                        acknowledgeRemotionLicense
                        ref={playerRef}
                        component={PointingInputVideo}
                        inputProps={{
                            videoUrl,
                            fps: FPS,
                        }}
                        durationInFrames={durationInFrames + 1}
                        compositionWidth={width}
                        compositionHeight={height}
                        fps={FPS}
                        style={{
                            width: isLandscape ? '100%' : undefined,
                            height: isLandscape ? undefined : '100%',
                        }}
                        className={css({
                            borderTopRadius: 'lg',
                        })}
                        moveToBeginningWhenEnded={false}
                    />
                </VideoDotControl>
            </div>
            <Controls
                playerRef={playerRef}
                framePoints={mapPointToData(userPoint)}
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
                    </ControlsGroup>
                </SplitControls>
            </Controls>
        </VideoPlayerWrapper>
    );
}

const PointingInputVideo = ({ videoUrl }: { videoUrl: string }) => {
    return <VideoOverlayHelper videoUrl={videoUrl}></VideoOverlayHelper>;
};

// determine if this can move to the wrapper component
// don't want to break everything
const pointingVideoWrapper = css({
    display: 'flex',
    flexDirection: 'column',
    flexShrink: '1',
    width: '[100%]',
    height: '[100%]',
});

const dotControlWrapper = css({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '[0]',
    flexShrink: '1',
    minWidth: '[0]',
});
