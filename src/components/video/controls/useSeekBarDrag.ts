import { useCallback, useEffect, useRef, useState } from 'react';
import { interpolate } from 'remotion';

import { useControls } from './context/ControlsContext';
import { usePlayback } from './context/usePlayback';
import { useTimeline } from './context/useTimeline';
import { useElementSize } from './useElementSize';

type Dragging =
    | {
          dragging: false;
      }
    | {
          dragging: true;
          wasPlaying: boolean;
      };

const getFrameFromX = (clientX: number, durationInFrames: number, width: number) => {
    const frame = Math.round(
        interpolate(clientX, [0, width], [0, Math.max(durationInFrames - 1, 0)], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
    );
    return frame;
};

export const useSeekBarDrag = () => {
    const { playerRef } = useControls();
    const { isPlaying, play, pause } = usePlayback();
    const { durationInFrames, seekTo } = useTimeline();

    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useElementSize(containerRef);

    const [dragging, setDragging] = useState<Dragging>({ dragging: false });

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLElement>) => {
            if (e.button !== 0) return;
            if (!playerRef.current) return;

            const posLeft = containerRef.current?.getBoundingClientRect().left ?? 0;
            const frame = getFrameFromX(e.clientX - posLeft, durationInFrames, width);

            pause();
            seekTo(frame);
            setDragging({ dragging: true, wasPlaying: isPlaying });
        },
        [durationInFrames, width, playerRef, isPlaying, pause, seekTo]
    );

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!dragging.dragging) return;
            if (!playerRef.current) return;

            const posLeft = containerRef.current?.getBoundingClientRect().left ?? 0;
            const frame = getFrameFromX(e.clientX - posLeft, durationInFrames, width);
            seekTo(frame);
        },
        [dragging.dragging, durationInFrames, playerRef, width, seekTo]
    );

    const handlePointerUp = useCallback(() => {
        if (!dragging.dragging) {
            setDragging({ dragging: false });
            return;
        }

        if (dragging.wasPlaying) {
            play();
        } else {
            pause();
        }

        setDragging({ dragging: false });
    }, [dragging, play, pause]);

    useEffect(() => {
        if (!dragging.dragging) return;

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [dragging.dragging, handlePointerMove, handlePointerUp]);

    return {
        containerRef,
        dragging: dragging.dragging,
        handlePointerDown,
    };
};
