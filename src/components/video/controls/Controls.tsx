import { css } from '@allenai/varnish-panda-runtime/css';
import type { PlayerRef } from '@remotion/player';
import {
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { interpolate } from 'remotion';

import type {
    VideoFramePoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

import { PlayPause } from './PlayPause';
import { SeekBar } from './SeekBar';
import { useElementSize } from './useElementSize';
import { useOnKeyDownControls } from './useOnKeyDownControls';

// helper
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

type Dragging =
    | {
          dragging: false;
      }
    | {
          dragging: true;
          wasPlaying: boolean;
      };

// Adapted from https://www.remotion.dev/docs/player/custom-controls#seek-bar
export const Controls: React.FC<{
    playerRef: RefObject<PlayerRef | null>;
    data: VideoTrackingPoints | VideoFramePoints;
    fps: number;
    durationInFrames: number;
    frameStyle: 'dot' | 'line';
}> = ({ data: videoPoints, playerRef, fps, durationInFrames, frameStyle }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useElementSize(containerRef); // We need to track element size for dragging the time scrub to work correctly.

    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
    const [dragging, setDragging] = useState<Dragging>({
        dragging: false,
    });

    const handleKeyDownControls = useOnKeyDownControls(
        playerRef,
        videoPoints,
        fps,
        durationInFrames
    );

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

    const handlePointerDown = useCallback(
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

    const handlePointerMove = useCallback(
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
        [dragging.dragging, durationInFrames, playerRef, width]
    );

    const handlePointerUp = useCallback(() => {
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
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [dragging.dragging, handlePointerMove, handlePointerUp]);

    const handlePlayPause = useCallback(() => {
        if (!playerRef.current) {
            return;
        }
        if (playing) {
            playerRef.current.pause();
        } else {
            playerRef.current.play();
        }
    }, [playerRef, playing]);

    return (
        <div className={controlsContainer}>
            <SeekBar
                ref={containerRef}
                videoPoints={videoPoints}
                fps={fps}
                durationInFrames={durationInFrames}
                frameStyle={frameStyle}
                dragging={dragging.dragging}
                frame={frame}
                onKeyDownControls={handleKeyDownControls}
                onPointerDown={handlePointerDown}
            />
            <div>
                <PlayPause playing={playing} handlePlayPause={handlePlayPause} />
            </div>
        </div>
    );
};

const controlsContainer = css({
    display: 'grid',
    gap: '2',
});
