import { css } from '@allenai/varnish-panda-runtime/css';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useRef, useState } from 'react';
import { varnishTheme } from '@allenai/varnish2/theme';
import { useVideoConfig, useCurrentFrame, AbsoluteFill } from 'remotion';

import { SeekBar } from '../seekBar/SeekBar';
import { useVideoMetaData } from '../useVideoMetaData';
import { VideoOverlayHelper } from '../VideoOverlayHelper';

const FPS = 24;

type UserPointSelect = {
    x: number; // in percentage
    y: number; // in percentage
    timestamp: number; // in seconds
};

export function VideoPointingInput({ videoUrl }: { videoUrl: string }) {
    const playerRef = useRef<PlayerRef>(null);

    const { durationInFrames, width, height } = useVideoMetaData(videoUrl, FPS);

    const [userPoints, setUserPoints] = useState<UserPointSelect[]>([]);

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
                    component={PointingInputVideo}
                    inputProps={{
                        videoUrl,
                        userPoints,
                        setUserPoints,
                    }}
                    durationInFrames={durationInFrames + 1}
                    compositionWidth={width}
                    compositionHeight={height}
                    fps={FPS}
                    style={{ width: '100%', flex: '1' }}
                    moveToBeginningWhenEnded={false}
                />
            </div>
            <SeekBar fps={FPS} playerRef={playerRef} durationInFrames={durationInFrames} />
        </div>
    );
}

export const PointSelect: React.FC<{
    children: ReactNode;
    onPointSelect: (point: UserPointSelect) => void;
}> = ({ children, onPointSelect }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const setPoint = (event: React.MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        // Get percentage x, y based on the parent frame
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        // Create VideoFramePoints based on the current frame
        const timestamp = frame / fps;
        onPointSelect({
            x,
            y,
            timestamp,
        });
    };

    return <AbsoluteFill onClick={setPoint}>{children}</AbsoluteFill>;
};

export const PointingInputVideo = ({
    videoUrl,
    userPoints,
    setUserPoints,
}: {
    videoUrl: string;
    userPoints: UserPointSelect[];
    setUserPoints: (points: UserPointSelect[]) => void;
}) => {
    return (
        <PointSelect onPointSelect={(point) => setUserPoints([point])}>
            <VideoOverlayHelper videoUrl={videoUrl}>
                {userPoints.map((point, i) => (
                    <SinglePoint key={i} point={point} />
                ))}
            </VideoOverlayHelper>
        </PointSelect>
    );
};

const SinglePoint = ({ point }: { point: UserPointSelect }) => {
    const { height, width, fps } = useVideoConfig();

    const frame = useCurrentFrame();

    if (point.timestamp / fps !== frame) {
        return null;
    }

    return (
        <svg
            className={css({ position: 'absolute', top: '0', left: '0' })}
            width={width}
            height={height}>
            <circle
                cx={`${point.x * 100}%`}
                cy={`${point.y * 100}%`}
                r={'1.5%'}
                stroke={'white'}
                strokeWidth={'0.3%'}
                fill={varnishTheme.palette.primary.main}
            />
        </svg>
    );
};
