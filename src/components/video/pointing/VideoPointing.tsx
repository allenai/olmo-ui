import { css } from '@allenai/varnish-panda-runtime/css';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useRef, useState } from 'react';

import { PerFrameTrackPoints } from '@/components/thread/points/pointsDataTypes';

import { SeekBar } from '../seekBar/SeekBar';
import { VideoTracking } from '../tracking/Tracking';
import { useVideoMetaData } from '../useVideoMetaData';

const FPS = 24;

export function VideoPointingInput({ videoUrl }: { videoUrl: string }) {
    const playerRef = useRef<PlayerRef>(null);

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
                    durationInFrames={durationInFrames + 1}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={FPS}
                    style={{ width: '100%', flex: '1' }}
                    moveToBeginningWhenEnded={false}
                />
            </div>
            <SeekBar fps={FPS} playerRef={playerRef} data={} durationInFrames={durationInFrames} />
        </div>
    );
}

export const PointSelect: React.FC<{
    playerRef: React.RefObject<PlayerRef | null>;
    children: ReactNode;
    frame: number;
}> = ({ children, frame }) => {
    const [points, setPoints] = useState<PerFrameTrackPoints[]>([]);

    const setPoint = (event: React.MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        // Get percentage x, y based on the parent frame
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        // Create VideoFramePoints based on the current frame
        const timestamp = frame / FPS;
        const newFramePoint: PerFrameTrackPoints = {
            timestamp,
            tracks: [
                {
                    trackId: `point-${Date.now()}`,
                    x,
                    y,
                },
            ],
        };

        // Add it to points
        const updatedPoints = [...points, newFramePoint];
        setPoints(updatedPoints);

        // Console log points
        console.log(updatedPoints);
    };

    return <span onClick={setPoint}>{children}</span>;
};
