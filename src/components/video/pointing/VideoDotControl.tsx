import { css } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import { varnishTheme } from '@allenai/varnish2/theme';
import { PlayerRef } from '@remotion/player';
import { ReactNode, useEffect, useRef, useState } from 'react';

import type { SchemaMolmo2PointPart } from '@/api/playgroundApi/playgroundApiSchema';
import { RemoveButton } from '@/components/thread/QueryForm/FileUploadThumbnails/Thumbnail';

export const VideoDotControl = ({
    children,
    onPointSelect,
    playerRef,
    userPoint,
    onRemoveFile,
    fps,
}: {
    children: ReactNode;
    onPointSelect: (point: SchemaMolmo2PointPart | null) => void;
    playerRef: React.RefObject<PlayerRef | null>;
    userPoint: SchemaMolmo2PointPart | null;
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
        if (!current || !userPoint) {
            return;
        }

        const onFrameUpdate = () => {
            setOnSelectedFrame(
                userPoint !== null && Math.abs(current.getCurrentFrame() - userPoint.time * fps) < 2
            );
        };

        current.addEventListener('frameupdate', onFrameUpdate);
        onFrameUpdate();

        return () => {
            current.removeEventListener('frameupdate', onFrameUpdate);
        };
    }, [playerRef, userPoint]);

    const setPoint = (point: SchemaMolmo2PointPart) => {
        setState('placed');
        setShowShockwave(true);
        setTimeout(() => {
            setShowShockwave(false);
        }, 400);
        onPointSelect(point);
    };

    const clearPoint = () => {
        setState('idle');
        onPointSelect(null);
    };

    const percentXYFromEvent = (event: React.PointerEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        return { x, y };
    };

    const onPointerUp = (event: React.PointerEvent) => {
        if (!playerRef.current || state === 'idle') {
            return;
        }

        const frame = playerRef.current.getCurrentFrame();
        const time = frame / fps;

        const { x, y } = percentXYFromEvent(event);

        const point = {
            x: +(x * 1000).toFixed(0),
            y: +(y * 1000).toFixed(0),
            time: +time.toFixed(2),
            type: 'molmo_2_input_point',
        } satisfies SchemaMolmo2PointPart;

        setPoint(point);
    };

    const onPointerMove = (event: React.PointerEvent) => {
        setMousePosition(percentXYFromEvent(event));
    };

    const handleMouseLeave = () => {
        setMousePosition(null);
    };

    const dotXValue = state === 'placing' ? mousePosition?.x : (userPoint?.x || 0) / 1000;
    const dotYValue = state === 'placing' ? mousePosition?.y : (userPoint?.y || 0) / 1000;
    const dotX = dotXValue ? `${dotXValue * 100}%` : undefined;
    const dotY = dotYValue ? `${dotYValue * 100}%` : undefined;

    return (
        <div
            ref={containerRef}
            className={css({ position: 'relative', touchAction: 'none' })}
            onMouseLeave={handleMouseLeave}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}>
            {children}
            {!!dotX && !!dotY && (onSelectedFrame || state === 'placing') && (
                <svg className={svgWrapper}>
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
                            animation: showShockwave ? 'placeDown 0.25s ease-out forwards' : '',
                            cursor: state === 'placing' ? 'grabbing' : 'grab',
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
                    size="small"
                    className={`${onScreenButton} ${css({ left: '5' })}`}
                    onClick={() => {
                        clearPoint();
                    }}>
                    Clear Point
                </Button>
            )}
            {state !== 'placing' && (
                <RemoveButton
                    filename="video"
                    onPressRemove={() => {
                        clearPoint();
                        onRemoveFile();
                    }}
                />
            )}
            {state === 'idle' && (
                <Button
                    variant="outlined"
                    size="small"
                    className={`${onScreenButton} ${css({ right: '5' })}`}
                    onClick={() => {
                        setState('placing');
                    }}>
                    Add Tracking Point
                </Button>
            )}
        </div>
    );
};

const svgWrapper = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '[100%]',
    height: '[100%]',
    pointerEvents: 'none',
});

const onScreenButton = css({
    color: 'cream.100',
    borderColor: 'cream.100',
    backgroundColor: 'extra-dark-teal.80',
    borderRadius: 'sm',
    position: 'absolute',
    bottom: '5',
    _hover: {
        borderColor: 'cream.100!', // IDK why i need important here
        outline: 'none',
    },
});
