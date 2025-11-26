import { css } from '@allenai/varnish-panda-runtime/css';
import { Player, PlayerRef } from '@remotion/player';
import { useRef, useState } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from '../seekBar/SeekBar';
import { useVideoMetaData } from '../useVideoMetaData';
import { VideoOverlayHelper } from '../VideoOverlayHelper';
import { UserPointSelect, VideoDotControl } from './VideoDotControl';
const FPS = 24;

export function VideoPointingInput({
    videoUrl,
    onRemoveFile,
}: {
    videoUrl: string;
    onRemoveFile: () => void;
}) {
    const playerRef = useRef<PlayerRef>(null);

    const { durationInFrames, width, height } = useVideoMetaData(videoUrl, FPS);

    const [userPoint, setUserPoint] = useState<UserPointSelect | null>(null);

    const mapPointToData = (userPoint: UserPointSelect | null) => {
        // TODO refactor seekbar to generic type
        const point: VideoTrackingPoints = {
            label: '1',
            type: 'track-points',
            frameList: userPoint
                ? [
                      {
                          timestamp: userPoint.timestamp,
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

    return (
        <div>
            <div
                style={{
                    aspectRatio: width / height,
                }}
                className={css({
                    maxHeight: '[60vh]',
                })}>
                <VideoDotControl
                    playerRef={playerRef}
                    onRemoveFile={onRemoveFile}
                    userPoint={userPoint}
                    fps={FPS}
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
                        style={{ width: '100%' }}
                        moveToBeginningWhenEnded={false}
                    />
                </VideoDotControl>
            </div>
            <SeekBar
                fps={FPS}
                playerRef={playerRef}
                data={mapPointToData(userPoint)}
                durationInFrames={durationInFrames}
            />
        </div>
    );
}

const PointingInputVideo = ({ videoUrl }: { videoUrl: string }) => {
    return <VideoOverlayHelper videoUrl={videoUrl}></VideoOverlayHelper>;
};
