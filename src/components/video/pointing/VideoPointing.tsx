import { css } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import { varnishTheme } from '@allenai/varnish2/theme';
import { Player, PlayerRef } from '@remotion/player';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { SeekBar } from '../seekBar/SeekBar';
import { useVideoMetaData } from '../useVideoMetaData';
import { VideoOverlayHelper } from '../VideoOverlayHelper';
import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';
import { RemoveButton } from '@/components/thread/QueryForm/FileUploadThumbnails/Thumbnail';

const FPS = 24;

type UserPointSelect = {
    x: number; // in percentage
    y: number; // in percentage
    timestamp: number; // in seconds
};

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
                <PointSelect
                    playerRef={playerRef}
                    onRemoveFile={onRemoveFile}
                    userPoint={userPoint}
                    onPointSelect={setUserPoint}>
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
            <SeekBar
                fps={FPS}
                playerRef={playerRef}
                data={mapPointToData(userPoint)}
                durationInFrames={durationInFrames}
            />
        </div>
    );
}

export const PointSelect = ({
    children,
    onPointSelect,
    playerRef,
    userPoint,
    onRemoveFile,
}: {
    children: ReactNode;
    onPointSelect: (point: UserPointSelect | null) => void;
    playerRef: React.RefObject<PlayerRef | null>;
    userPoint: UserPointSelect | null;
    onRemoveFile: () => void;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [state, setState] = useState<'idle' | 'placing' | 'placed'>('idle');
    const [showShockwave, setShowShockwave] = useState(false);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
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

    const setPoint = (point: null | UserPointSelect) => {
        if (!point) {
            setState('idle');
            onPointSelect(null);
            return;
        }
        setState('placed');
        setShowShockwave(true);
        setTimeout(() => {
            setShowShockwave(false);
        }, 400);
        onPointSelect(point);
    };

    const onMouseDown = (event: React.MouseEvent) => {
        if (!playerRef.current) {
            return;
        }
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
        setPoint(point);
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

    const dotXValue = state === 'placing' ? mousePosition?.x : userPoint?.x;
    const dotYValue = state === 'placing' ? mousePosition?.y : userPoint?.y;
    const dotX = dotXValue ? `${dotXValue * 100}%` : undefined;
    const dotY = dotYValue ? `${dotYValue * 100}%` : undefined;

    return (
        <div
            ref={containerRef}
            className={css({ position: 'relative' })}
            onClick={state !== 'idle' ? onMouseDown : undefined}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}>
            {state !== 'placing' && <RemoveButton filename="video" onPressRemove={onRemoveFile} />}

            {children}
            {state === 'idle' && (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    className={css({
                        backgroundColor: 'extra-dark-teal.70',
                        borderRadius: 'md',
                        position: 'absolute',
                        bottom: '5',
                        right: '5',
                    })}
                    onClick={() => {
                        setState('placing');
                    }}>
                    Place Point (optional)
                </Button>
            )}

            {state === 'placed' && (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    className={css({
                        backgroundColor: 'extra-dark-teal.70',
                        borderRadius: 'full',

                        position: 'absolute',
                        bottom: '5',
                        right: '5',
                    })}
                    onClick={() => {
                        setPoint(null);
                    }}>
                    Clear Point
                </Button>
            )}
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
                        x1={dotX}
                        y1={0}
                        x2={dotX}
                        y2="100%"
                        stroke="white"
                        strokeWidth={1.25}
                        strokeDasharray="8 8"
                    />
                    {/* Horizontal dashed line */}
                    <line
                        x1={0}
                        y1={dotY}
                        x2="100%"
                        y2={dotY}
                        stroke="white"
                        strokeWidth={1.25}
                        strokeDasharray="8 8"
                    />
                    <circle
                        cx={dotX}
                        cy={dotY}
                        r={state === 'placing' ? 12 : 10}
                        stroke="white"
                        strokeWidth={2}
                        fill={varnishTheme.palette.secondary.main}
                        style={{
                            pointerEvents: 'auto',
                            ...(showShockwave
                                ? { animation: 'placeDown 0.25s ease-out forwards' }
                                : {}),
                            ...(state === 'placed' ? { cursor: 'grab' } : {}),
                            ...(state === 'placing' ? { cursor: 'grabbing' } : {}),
                        }}
                        onMouseDown={(e) => {
                            if (state === 'placed') {
                                e.stopPropagation();
                                setState('placing');
                                onPointSelect(null);
                            }
                        }}
                    />
                    {showShockwave && (
                        <>
                            <circle
                                cx={dotX}
                                cy={dotY}
                                r={10}
                                stroke={varnishTheme.palette.secondary.main}
                                strokeWidth={2}
                                fill="none"
                                style={{ animation: 'shockwave 0.4s ease-out forwards' }}
                            />
                            <circle
                                cx={dotX}
                                cy={dotY}
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
