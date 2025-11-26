import { css, cva } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import { Route } from '@mui/icons-material';
import { Box } from '@mui/material';
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
            setOnSelectedFrame(Math.abs(current.getCurrentFrame() - userPoint.time * fps) < 2);
        };

        current.addEventListener('frameupdate', onFrameUpdate);
        onFrameUpdate();

        return () => {
            current.removeEventListener('frameupdate', onFrameUpdate);
        };
    }, [playerRef, userPoint, fps]);

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
                <Box
                    component="svg"
                    className={svgWrapper}
                    sx={{
                        '@keyframes shockwave': {
                            '0%': { r: 10, opacity: 0.75, strokeWidth: 3 },
                            '100%': { r: 30, opacity: 0, strokeWidth: 0.5 },
                        },
                        '@keyframes placeDown': {
                            '0%': { r: 14 },
                            '50%': { r: 8 },
                            '100%': { r: 10 },
                        },
                    }}>
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
                        className={mainDotStyle}
                        data-placing={state === 'placing' || undefined}
                        data-animating={showShockwave || undefined}
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
                                strokeWidth={2}
                                fill="none"
                                className={shockwaveStyle({ variant: 'primary' })}
                            />
                            <circle
                                cx={dotX}
                                cy={dotY}
                                r={10}
                                stroke="white"
                                strokeWidth={1.5}
                                fill="none"
                                className={shockwaveStyle({ variant: 'secondary' })}
                            />
                        </>
                    )}
                </Box>
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
            {state === 'placed' && (
                <Button
                    variant="outlined"
                    size="small"
                    className={onScreenButtonRecipe({ position: 'left' })}
                    onClick={() => {
                        clearPoint();
                    }}>
                    Clear Point
                </Button>
            )}

            {state === 'idle' && (
                <Button
                    variant="outlined"
                    size="small"
                    className={onScreenButtonRecipe({ position: 'right' })}
                    onClick={() => {
                        setState('placing');
                    }}>
                    <Route />
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

const mainDotStyle = css({
    fill: 'accent.secondary',
    pointerEvents: 'auto',
    cursor: 'grab',
    '&[data-placing]': {
        cursor: 'grabbing',
    },
    '&[data-animating]': {
        animation: 'placeDown 0.25s ease-out forwards',
    },
});

const shockwaveStyle = cva({
    base: {
        animation: 'shockwave 0.4s ease-out forwards',
    },
    variants: {
        variant: {
            primary: {
                stroke: 'accent.secondary',
            },
            secondary: {
                animationDelay: '0.05s',
            },
        },
    },
});

const onScreenButtonRecipe = cva({
    base: {
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
    },
    variants: {
        position: {
            left: {
                left: '5',
            },
            right: {
                right: '5',
            },
        },
    },
});
