import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { interpolate } from 'remotion';

import { VideoTrackingPoints } from './example';

const getFrameFromX = (clientX: number, durationInFrames: number, width: number) => {
    const pos = clientX;
    const frame = Math.round(
        interpolate(pos, [0, width], [0, Math.max(durationInFrames - 1, 0)], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
    );
    return frame;
};

const BAR_HEIGHT = 5;
const KNOB_SIZE = 12;
const VERTICAL_PADDING = 4;

const containerStyle: React.CSSProperties = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    paddingTop: VERTICAL_PADDING,
    paddingBottom: VERTICAL_PADDING,
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    touchAction: 'none',
    flex: 1,
};

const barBackground: React.CSSProperties = {
    height: BAR_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
    borderRadius: BAR_HEIGHT / 2,
};

const findBodyInWhichDivIsLocated = (div: HTMLElement) => {
    let current = div;

    while (current.parentElement) {
        current = current.parentElement;
    }

    return current;
};

export const SeekBar: React.FC<{
    durationInFrames: number;
    inFrame?: number | null;
    outFrame?: number | null;
    playerRef: React.RefObject<PlayerRef | null>;

    data: VideoTrackingPoints;
    width: number;
}> = ({ durationInFrames, width, inFrame, outFrame, playerRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const { current } = playerRef;
        if (!current) {
            return;
        }

        const onFrameUpdate = () => {
            setFrame(current.getCurrentFrame());
        };

        current.addEventListener('frameupdate', onFrameUpdate);

        return () => {
            current.removeEventListener('frameupdate', onFrameUpdate);
        };
    }, [playerRef]);

    useEffect(() => {
        const { current } = playerRef;
        if (!current) {
            return;
        }

        const onPlay = () => {
            setPlaying(true);
        };

        const onPause = () => {
            setPlaying(false);
        };

        current.addEventListener('play', onPlay);
        current.addEventListener('pause', onPause);

        return () => {
            current.removeEventListener('play', onPlay);
            current.removeEventListener('pause', onPause);
        };
    }, [playerRef]);

    const [dragging, setDragging] = useState<
        | {
              dragging: false;
          }
        | {
              dragging: true;
              wasPlaying: boolean;
          }
    >({
        dragging: false,
    });

    const onPointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (e.button !== 0) {
                return;
            }

            if (!playerRef.current) {
                return;
            }

            const posLeft = containerRef.current?.getBoundingClientRect().left as number;

            const _frame = getFrameFromX(e.clientX - posLeft, durationInFrames, width);
            playerRef.current.pause();
            playerRef.current.seekTo(_frame);
            setDragging({
                dragging: true,
                wasPlaying: playing,
            });
        },
        [durationInFrames, width, playerRef, playing]
    );

    const onPointerMove = useCallback(
        (e: PointerEvent) => {
            if (!dragging.dragging) {
                return;
            }

            if (!playerRef.current) {
                return;
            }

            const posLeft = containerRef.current?.getBoundingClientRect().left as number;

            const _frame = getFrameFromX(e.clientX - posLeft, durationInFrames, width);
            playerRef.current.seekTo(_frame);
        },
        [dragging.dragging, durationInFrames, playerRef]
    );

    const onPointerUp = useCallback(() => {
        setDragging({
            dragging: false,
        });
        if (!dragging.dragging) {
            return;
        }

        if (!playerRef.current) {
            return;
        }

        if (dragging.wasPlaying) {
            playerRef.current.play();
        } else {
            playerRef.current.pause();
        }
    }, [dragging, playerRef]);

    useEffect(() => {
        if (!dragging.dragging) {
            return;
        }

        const body = findBodyInWhichDivIsLocated(containerRef.current as HTMLElement);

        body.addEventListener('pointermove', onPointerMove);
        body.addEventListener('pointerup', onPointerUp);
        return () => {
            body.removeEventListener('pointermove', onPointerMove);
            body.removeEventListener('pointerup', onPointerUp);
        };
    }, [dragging.dragging, onPointerMove, onPointerUp]);

    const knobStyle: React.CSSProperties = useMemo(() => {
        return {
            height: KNOB_SIZE,
            width: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            position: 'absolute',
            top: VERTICAL_PADDING - KNOB_SIZE / 2 + 5 / 2,
            backgroundColor: '#000',
            left: Math.max(0, (frame / Math.max(1, durationInFrames - 1)) * width - KNOB_SIZE / 2),
            boxShadow: '0 0 2px black',
            transition: 'opacity 0.1s ease',
        };
    }, [durationInFrames, frame, width]);

    const fillStyle: React.CSSProperties = useMemo(() => {
        return {
            height: BAR_HEIGHT,
            backgroundColor: '#000',
            width: ((frame - (inFrame ?? 0)) / (durationInFrames - 1)) * 100 + '%',
            marginLeft: ((inFrame ?? 0) / (durationInFrames - 1)) * 100 + '%',
            borderRadius: BAR_HEIGHT / 2,
        };
    }, [durationInFrames, frame, inFrame]);

    const active: React.CSSProperties = useMemo(() => {
        return {
            height: BAR_HEIGHT,
            backgroundColor: '#000',
            opacity: 0.6,
            width:
                (((outFrame ?? durationInFrames - 1) - (inFrame ?? 0)) / (durationInFrames - 1)) *
                    100 +
                '%',
            marginLeft: ((inFrame ?? 0) / (durationInFrames - 1)) * 100 + '%',
            borderRadius: BAR_HEIGHT / 2,
            position: 'absolute',
        };
    }, [durationInFrames, inFrame, outFrame]);

    return (
        <div
            ref={containerRef}
            onPointerDown={onPointerDown}
            style={{ ...containerStyle, width: width + 'px' }}>
            <div style={barBackground}>
                <div style={active} />
                <div style={fillStyle} />
            </div>
            <div style={knobStyle} />
        </div>
    );
};
