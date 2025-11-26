import { css } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import { varnishTheme } from '@allenai/varnish2/theme';
import { PlayerRef } from '@remotion/player';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { RemoveButton } from '@/components/thread/QueryForm/FileUploadThumbnails/Thumbnail';

export type UserPointSelect = {
    x: number; // in percentage
    y: number; // in percentage
    timestamp: number; // in seconds
};

export const VideoDotControl = ({
    children,
    onPointSelect,
    playerRef,
    userPoint,
    onRemoveFile,
    fps,
}: {
    children: ReactNode;
    onPointSelect: (point: UserPointSelect | null) => void;
    playerRef: React.RefObject<PlayerRef | null>;
    userPoint: UserPointSelect | null;
    onRemoveFile: () => void;
    fps: number;
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

            if (Math.abs(current.getCurrentFrame() - userPoint.timestamp * fps) < 2) {
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

    const onPointerUp = (event: React.PointerEvent) => {
        if (!playerRef.current || state === 'idle') {
            return;
        }
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const frame = playerRef.current.getCurrentFrame();
        const timestamp = frame / fps;
        const point = {
            x,
            y,
            timestamp,
        };
        setPoint(point);
    };

    const onPointerMove = (event: React.PointerEvent) => {
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
            className={css({ position: 'relative', touchAction: 'none' })}
            onMouseLeave={handleMouseLeave}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}>
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
                        onPointerDown={(e) => {
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
            {state === 'placed' && (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    className={css({
                        backgroundColor: 'extra-dark-teal.70',
                        borderRadius: 'md',
                        position: 'absolute',
                        bottom: '5',
                        left: '5',
                    })}
                    onClick={() => {
                        setPoint(null);
                    }}>
                    Clear Point
                </Button>
            )}
        </div>
    );
};
