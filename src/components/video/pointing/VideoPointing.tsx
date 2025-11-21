import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useRef, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

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
            <div className={css({})}>
                <PointSelect
                    className={css({
                        maxHeight: '[60vh]',
                        aspectRatio: width / height,
                    })}
                    playerRef={playerRef}
                    onPointSelect={(point) => {
                        setUserPoints([point]);
                    }}>
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
                        style={{ width: '100%' }}
                        moveToBeginningWhenEnded={false}
                    />
                </PointSelect>
            </div>
            <SeekBar fps={FPS} playerRef={playerRef} durationInFrames={durationInFrames} />
        </div>
    );
}

export const PointSelect: React.FC<{
    children: ReactNode;
    className: string;
    onPointSelect: (point: UserPointSelect) => void;
    playerRef: React.RefObject<PlayerRef | null>;
}> = ({ children, onPointSelect, playerRef, className }) => {
    const setPoint = (event: React.MouseEvent) => {
        if (!playerRef.current) {
            return;
        }
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const frame = playerRef.current.getCurrentFrame();
        const timestamp = frame * FPS;
        onPointSelect({
            x,
            y,
            timestamp,
        });
    };

    return (
        <div className={className} onClick={setPoint}>
            {children}
        </div>
    );
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
    const { height, width } = useVideoConfig();
    return (
        <VideoOverlayHelper videoUrl={videoUrl}>
            <svg
                className={css({ position: 'absolute', top: '0', left: '0' })}
                width={width}
                height={height}>
                {userPoints.map((point, i) => (
                    <SinglePoint key={i} point={point} />
                ))}
            </svg>
        </VideoOverlayHelper>
    );
};

const SinglePoint = ({ point }: { point: UserPointSelect }) => {
    const { fps } = useVideoConfig();

    const frame = useCurrentFrame();

    if (point.timestamp / fps !== frame) {
        return null;
    }

    return (
        <circle
            cx={`${point.x * 100}%`}
            cy={`${point.y * 100}%`}
            r={'1.5%'}
            stroke={'white'}
            strokeWidth={'0.3%'}
            fill={varnishTheme.palette.primary.main}
        />
    );
};

const UserPointHoever = () => {
    return <div>hi</div>;
};
