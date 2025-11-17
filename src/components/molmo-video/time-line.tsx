import { css } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { interpolate } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

import { useKeyboardControls } from './KeyboardControls';

const getFrameFromX = (clientX: number, durationInFrames: number, width: number) => {
    const pos = clientX;
    const frame = Math.round(
        interpolate(pos, [0, width], [0, Math.max(durationInFrames, 0)], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
    );
    return frame;
};

const BAR_HEIGHT = 25;
const KNOB_WIDTH = 10;

const TIMELINE_PADDING = 20;

export const SeekBar: React.FC<{
    playerRef: React.RefObject<PlayerRef | null>;
    data: VideoTrackingPoints;
    width: number;
    fps: number;
    durationInFrames: number;
}> = ({ data, width: inputWidth, playerRef, fps, durationInFrames }) => {
    const width = inputWidth;
    const containerRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);

    useKeyboardControls(playerRef, data, fps, durationInFrames);

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
            <Button className={playPauseButton} onClick={handlePlayPause}>
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <div
                className={timeLineStyle}
                style={{
                    width: `${width + TIMELINE_PADDING}px`,
                    paddingInline: TIMELINE_PADDING / 2,
                }}>
                <div
                    style={{
                        width: `${(frame / (durationInFrames - 1)) * width + TIMELINE_PADDING / 2}px`,
                        marginLeft: TIMELINE_PADDING / -2,
                        position: 'absolute',
                    }}
                    className={barFill}
                />

                <div ref={containerRef} onPointerDown={onPointerDown} className={innerTimeline}>
                    <TrackingDotsTimeLine
                        fps={fps}
                        durationInFrames={durationInFrames}
                        data={data}
                    />
                    <div
                        id="knob"
                        className={knob}
                        style={{
                            left: `calc(${(frame / durationInFrames) * 100}% - ${KNOB_WIDTH / 2}px)`,
                            cursor: dragging.dragging ? 'grabbing' : 'grab',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const TRACKING_DOT_SIZE = 10;
const TrackingDotsTimeLine = ({
    data,
    durationInFrames,
    fps,
}: {
    data: VideoTrackingPoints;
    durationInFrames: number;
    fps: number;
}) => {
    const dots = useMemo(() => {
        return data.frameList.map((frame) => {
            return (frame.timestamp / (durationInFrames / fps)) * 100;
        });
    }, [data, durationInFrames, fps]);

    return (
        <>
            {dots.map((leftOffset, index) => {
                return (
                    <div
                        key={index}
                        className={css({
                            position: 'absolute',
                            width: `[${TRACKING_DOT_SIZE}px]`,
                            height: `[${TRACKING_DOT_SIZE}px]`,
                            borderRadius: 'full',
                            backgroundColor: 'pink.100',
                            top: '2',
                        })}
                        style={{ left: `calc(${leftOffset}% - ${TRACKING_DOT_SIZE / 2}px)` }}
                    />
                );
            })}
        </>
    );
};

const timeLineStyle = css({
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
    height: `[${BAR_HEIGHT}px]`,
    width: 'auto',
    position: 'relative',
});

const barFill = css({
    height: `[${BAR_HEIGHT}px]`,
    backgroundColor: 'pink.10',
    borderRadius: 'sm',
});

const knob = css({
    height: `[${BAR_HEIGHT + 10}px]`,
    width: `[${KNOB_WIDTH}px]`,
    borderRadius: 'sm',
    position: 'absolute',
    cursor: 'grab',
    top: '[-4px]',
    backgroundColor: 'teal.100',
});

const timelineWrapper = css({
    display: 'flex',
    alignItems: 'center',
    gap: '2',
});

const playPauseButton = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1',
    backgroundColor: 'accent.primary',
    border: '2px solid',
    borderColor: 'elements.primary.stroke',
    color: 'white',
    borderRadius: 'full',
    cursor: 'pointer',
    transition: '[all 0.2s]',
    _hover: {
        backgroundColor: 'elements.primary.hovered.fill',
    },
});
