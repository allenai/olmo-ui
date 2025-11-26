import { css } from '@allenai/varnish-panda-runtime/css';
import type { PlayerRef } from '@remotion/player';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Key } from 'react-aria-components';
import { interpolate } from 'remotion';

import type {
    VideoFramePoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

import { FullScreenButton } from './FullScreenButton';
import { PlayPause } from './PlayPause';
import { SeekBar } from './SeekBar';
import { SeekNext } from './SeekNext';
import { SeekPrevious } from './SeekPrevious';
import { SettingsControl } from './SettingsControl';
import { TimeDisplay } from './TimeDisplay';
import { useElementSize } from './useElementSize';
import { useOnKeyDownControls } from './useOnKeyDownControls';
import { VolumeControl } from './VolumeControl';

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

interface ControlsProps {
    playerRef: RefObject<PlayerRef | null>;
    data: VideoTrackingPoints | VideoFramePoints;
    fps: number;
    durationInFrames: number;
    frameStyle: 'dot' | 'line';
}

// Adapted from https://www.remotion.dev/docs/player/custom-controls#seek-bar
export const Controls = ({
    data: videoPoints,
    playerRef,
    fps,
    durationInFrames,
    frameStyle,
}: ControlsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useElementSize(containerRef); // We need to track element size for dragging the time scrub to work correctly.

    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
    const [dragging, setDragging] = useState<Dragging>({
        dragging: false,
    });

    const { handleKeyDown, jumpBasedOnCurrent } = useOnKeyDownControls(
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
                onKeyDownControls={handleKeyDown}
                onPointerDown={handlePointerDown}
            />
            <div className={bottomControls}>
                <div className={controlsGroup}>
                    <SeekPrevious
                        isDisabled={frame === 0}
                        jumpBasedOnCurrent={jumpBasedOnCurrent}
                    />
                    <PlayPause playing={playing} handlePlayPause={handlePlayPause} />
                    <SeekNext
                        isDisabled={frame === durationInFrames - 1}
                        jumpBasedOnCurrent={jumpBasedOnCurrent}
                    />
                </div>
                <div className={controlsGroup}>
                    <TimeDisplay
                        playerRef={playerRef}
                        durationInFrames={durationInFrames}
                        fps={fps}
                    />
                    <VolumeControl playerRef={playerRef} />
                    {/* <SettingsControl menuItems={[]} onAction={() => {}} /> */}
                    <FullScreenButton playerRef={playerRef} />
                </div>
            </div>
        </div>
    );
};

const controlsContainer = css({
    backgroundColor: {
        base: 'white',
        _dark: 'cream.10',
    },
    display: 'grid',

    gap: '2',
    paddingInline: '3',
    paddingBlockStart: '2',
    paddingBlockEnd: '1',

    borderBottomRadius: 'sm',
});

const bottomControls = css({
    display: 'flex',
    justifyContent: 'space-between',
});

const controlsGroup = css({
    display: 'flex',
    gap: '2',
});
