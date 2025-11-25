import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

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
                style={{
                    aspectRatio: width / height,
                }}
                className={css({
                    maxHeight: '[60vh]',
                })}>
                <PointSelect
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
    onPointSelect: (point: UserPointSelect) => void;
    playerRef: React.RefObject<PlayerRef | null>;
}> = ({ children, onPointSelect, playerRef }) => {
    const [state, setState] = useState<'idle' | 'placing' | 'placed'>('placing');
    const [userPoint, setUserPoint] = useState<UserPointSelect | null>(null);
    const [showShockwave, setShowShockwave] = useState(false);

    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [onSelectedFrame, setOnSelectedFrame] = useState<boolean>(false);

    useEffect(() => {
        const { current } = playerRef;
        if (!current) {
            return;
        }

        const onFrameUpdate = () => {
            if (!userPoint) {
                return;
            }

            if (Math.abs(current.getCurrentFrame() - userPoint.timestamp * FPS) < 2) {
                setOnSelectedFrame(true);
            } else {
                setOnSelectedFrame(false);
            }
        };

        current.addEventListener('frameupdate', onFrameUpdate);
        onFrameUpdate();

        return () => {
            current.removeEventListener('frameupdate', onFrameUpdate);
        };
    }, [playerRef, userPoint]);

    const setPoint = (event: React.MouseEvent) => {
        if (!playerRef.current) {
            return;
        }
        setState('placed');
        setShowShockwave(true);
        setTimeout(() => {
            setShowShockwave(false);
        }, 400);

        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const frame = playerRef.current.getCurrentFrame();
        const timestamp = frame / FPS;
        const point = {
            x,
            y,
            timestamp,
        };
        onPointSelect(point);

        setUserPoint(point);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition(null);
    };

    const dotX = state === 'placing' ? mousePosition?.x : userPoint!.x;
    const dotY = state === 'placing' ? mousePosition?.y : userPoint!.y;

    return (
        <div
            ref={containerRef}
            className={css({ position: 'relative' })}
            onClick={setPoint}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}>
            {children}
            {!!dotX && !!dotY && (onSelectedFrame || state === 'placing') && (
                <svg
                    className={css({
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '[100%]',
                        height: '[100%]',
                        pointerEvents: 'none',
                    })}>
                    <defs>
                        <filter id="circleShadow" x="-50%" y="-50%" width="300%" height="300%">
                            <feDropShadow
                                dx="0"
                                dy="0"
                                stdDeviation="4"
                                floodColor={varnishTheme.palette.secondary.main}
                                floodOpacity="0.8"
                            />
                        </filter>
                    </defs>
                    <style>
                        {`
                            @keyframes shockwave {
                                0% {
                                    r: 10;
                                    opacity: .75;
                                    stroke-width: 3;
                                }
                                100% {
                                    r: 30;
                                    opacity: 0;
                                    stroke-width: 0.5;
                                }
                            }
                            @keyframes placeDown {
                                0% {
                                    r: 14;
                                }
                                50% {
                                    r: 8;
                                }
                                100% {
                                    r: 10;
                                }
                            }
                        `}
                    </style>
                    {/* Vertical dashed line */}
                    <line
                        x1={dotX * 100 + '%'}
                        y1={0}
                        x2={dotX * 100 + '%'}
                        y2="100%"
                        stroke="white"
                        strokeWidth={1}
                        strokeDasharray="8 8"
                    />
                    {/* Horizontal dashed line */}
                    <line
                        x1={0}
                        y1={dotY * 100 + '%'}
                        x2="100%"
                        y2={dotY * 100 + '%'}
                        stroke="white"
                        strokeWidth={1}
                        strokeDasharray="8 8"
                    />
                    <circle
                        cx={dotX * 100 + '%'}
                        cy={dotY * 100 + '%'}
                        r={state === 'placing' ? 12 : 10}
                        stroke="white"
                        strokeWidth={2}
                        fill={varnishTheme.palette.secondary.main}
                        filter={state === 'placing' ? 'url(#circleShadow)' : ''}
                        style={{
                            ...(showShockwave
                                ? { animation: 'placeDown 0.25s ease-out forwards' }
                                : {}),
                            ...(state === 'placed'
                                ? { cursor: 'pointer', pointerEvents: 'auto' }
                                : {}),
                        }}
                        onMouseDown={
                            state === 'placed'
                                ? (e) => {
                                      e.stopPropagation();
                                      setState('placing');
                                      setUserPoint(null);
                                  }
                                : undefined
                        }
                    />
                    {showShockwave && (
                        <>
                            <circle
                                cx={dotX * 100 + '%'}
                                cy={dotY * 100 + '%'}
                                r={10}
                                stroke={varnishTheme.palette.secondary.main}
                                strokeWidth={2}
                                fill="none"
                                style={{ animation: 'shockwave 0.4s ease-out forwards' }}
                            />
                            <circle
                                cx={dotX * 100 + '%'}
                                cy={dotY * 100 + '%'}
                                r={10}
                                stroke="white"
                                strokeWidth={1.5}
                                fill="none"
                                style={{ animation: 'shockwave 0.4s ease-out 0.05s forwards' }}
                            />
                        </>
                    )}
                </svg>
            )}
        </div>
    );
};

export const PointingInputVideo = ({ videoUrl }: { videoUrl: string }) => {
    return <VideoOverlayHelper videoUrl={videoUrl}></VideoOverlayHelper>;
};
