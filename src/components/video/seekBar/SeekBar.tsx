import { css } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { interpolate } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { TrackingDotsTimeline } from './TrackingDotsTimeLine';
import { useElementSize } from './useElementSize';
import { useOnKeyDownControls } from './useOnKeyDownControls';

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

// Adapted from https://www.remotion.dev/docs/player/custom-controls#seek-bar
export const SeekBar: React.FC<{
    playerRef: React.RefObject<PlayerRef | null>;
    data: VideoTrackingPoints;
    fps: number;
    durationInFrames: number;
}> = ({ data, playerRef, fps, durationInFrames }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useElementSize(containerRef); // We need to track element size for dragging the time scrub to work correctly.

    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
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

    const onKeyDownControls = useOnKeyDownControls(playerRef, data, fps, durationInFrames);

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
        [dragging.dragging, durationInFrames, playerRef, width]
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
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [dragging.dragging, onPointerMove, onPointerUp]);

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
        <div className={timelineWrapper}>
            <Button
                className={playPauseButton}
                onClick={handlePlayPause}
                onKeyDown={(e) => {
                    onKeyDownControls(e, true);
                }}>
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <div
                role="slider"
                aria-label="Video progress"
                aria-valuemin={0}
                aria-valuemax={(durationInFrames - 1) / fps}
                aria-valuenow={frame / fps}
                tabIndex={0}
                className={timelineStyle}
                onKeyDown={onKeyDownControls}>
                <div ref={containerRef} onPointerDown={onPointerDown} className={innerTimeline}>
                    <div
                        style={{
                            width: `calc(${(frame / (durationInFrames - 1)) * 100}% + var(--timeline-padding) )`,
                        }}
                        className={barFill}
                    />
                    <TrackingDotsTimeline
                        fps={fps}
                        durationInFrames={durationInFrames}
                        data={data}
                    />
                    <div
                        id="knob"
                        className={knob}
                        data-dragging={dragging.dragging}
                        style={{
                            left: `calc(${(frame / (durationInFrames - 1)) * 100}% - var(--knob-width) / 2)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const timelineStyle = css({
    paddingInline: 'var(--timeline-padding)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    touchAction: 'none',
    backgroundColor: 'white',
    borderRadius: 'sm',
    borderWidth: '2',
    borderColor: 'pink.30',
    flex: '1',
});

const innerTimeline = css({
    height: 'var(--bar-height)',
    width: 'auto',
    position: 'relative',
});

const barFill = css({
    height: 'var(--bar-height)',
    backgroundColor: 'pink.20',
    borderRadius: 'sm',
    position: 'absolute',
    marginLeft: `[calc( -1 * var(--timeline-padding) )]`,
    left: '0',
});

const knob = css({
    '--knob-width': '10px',
    height: '[calc(var(--bar-height) + 10px)]',
    width: 'var(--knob-width)',
    borderRadius: 'sm',
    position: 'absolute',
    cursor: 'grab',
    top: '[-5px]',
    backgroundColor: 'teal.100',
    '&[data-dragging=true]': {
        cursor: 'grabbing',
    },
});

const timelineWrapper = css({
    display: 'flex',
    alignItems: 'center',
    paddingTop: '3',
    gap: '2',
    '--bar-height': '25px',
    '--timeline-padding': '10px',
});

const playPauseButton = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1',
    backgroundColor: 'accent.primary',
    borderStyle: 'solid',
    borderWidth: '2',
    borderColor: 'elements.primary.stroke',
    color: 'white',
    borderRadius: 'full',
    cursor: 'pointer',
    transition: '[all 0.2s]',
    _hover: {
        backgroundColor: 'elements.primary.hovered.fill',
    },
});
