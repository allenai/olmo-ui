import { css } from '@allenai/varnish-panda-runtime/css';
import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { interpolate } from 'remotion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { Button } from '@allenai/varnish-ui';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';
import { useKeyboardControls } from './KeyboardControls';

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

const BAR_HEIGHT = 25;
const KNOB_WIDTH = 10;

const LEFT_OFF_SET = 10;
const findBodyInWhichDivIsLocated = (div: HTMLElement) => {
    let current = div;

    while (current.parentElement) {
        current = current.parentElement;
    }

    return current;
};

export const SeekBar: React.FC<{
    playerRef: React.RefObject<PlayerRef | null>;
    data: VideoTrackingPoints;
    width: number;
    fps: number;
    durationInFrames: number;
}> = ({ data, width: inputWidth, playerRef, fps, durationInFrames }) => {
    const width = inputWidth - 50;
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
                className={containerStyle}
                ref={containerRef}
                onPointerDown={onPointerDown}
                style={{ width: width + 'px' }}>
                <div className={barBackground}>
                    <div
                        style={{
                            width: (frame / (durationInFrames - 1)) * width + LEFT_OFF_SET + 'px',
                        }}
                        className={barFill}
                    />

                    <TrackingDotsTimeLine
                        fps={fps}
                        width={width}
                        durationInFrames={durationInFrames}
                        data={data}
                    />
                    <div
                        id="knob"
                        className={knob}
                        style={{
                            left:
                                LEFT_OFF_SET +
                                Math.max(
                                    0,
                                    (frame / Math.max(1, durationInFrames - 1)) * width -
                                        KNOB_WIDTH / 2
                                ),
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
    width,
    fps,
}: {
    data: VideoTrackingPoints;
    durationInFrames: number;
    width: number;
    fps: number;
}) => {
    const dots = useMemo(() => {
        return data.frameList.map((frame) => {
            return frame.timestamp / (durationInFrames / fps);
        });
    }, [data]);

    return (
        <div
            className={css({
                position: 'absolute',
                width: `[${width}px]`,
                top: '[15px]',
            })}>
            {dots.map((dot, index) => {
                return (
                    <div
                        key={index}
                        className={css({
                            position: 'absolute',
                            width: `[${TRACKING_DOT_SIZE}px]`,
                            height: `[${TRACKING_DOT_SIZE}px]`,
                            borderRadius: 'full',
                            backgroundColor: 'pink.100',
                        })}
                        style={{ left: dot * width - TRACKING_DOT_SIZE / 2 + LEFT_OFF_SET + 'px' }}
                    />
                );
            })}
        </div>
    );
};

const containerStyle = css({
    userSelect: 'none',
    WebkitUserSelect: 'none',
    paddingTop: '2',
    paddingBottom: '2',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    touchAction: 'none',
    flex: '1',
});

const barBackground = css({
    height: `[${BAR_HEIGHT}px]`,
    width: 'auto',
    borderRadius: 'sm',
    backgroundColor: 'white',
    borderWidth: '2',
    borderColor: 'pink.30',
});

const barFill = css({
    height: `[${BAR_HEIGHT - 4}px]`,
    backgroundColor: 'pink.10',
    borderRadius: 'sm',
});

const knob = css({
    height: `[${BAR_HEIGHT + 10}px]`,
    width: `[${KNOB_WIDTH}px]`,
    borderRadius: 'sm',
    position: 'absolute',
    cursor: 'grab',
    top: '1',
    backgroundColor: 'dark-teal.100',
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
    backgroundColor: 'white',
    border: '2px solid',
    borderColor: 'pink.30',
    borderRadius: 'full',
    cursor: 'pointer',
    transition: '[all 0.2s]',
    _hover: {
        backgroundColor: 'pink.10',
    },
});
