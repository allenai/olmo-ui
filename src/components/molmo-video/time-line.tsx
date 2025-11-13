import { css } from '@allenai/varnish-panda-runtime/css';
import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { interpolate, useVideoConfig } from 'remotion';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

const useKeyboardControls = (
    playerRef: React.RefObject<PlayerRef | null>,
    data: VideoTrackingPoints
) => {
    const { fps } = useVideoConfig();
    const timesOfInterest = useMemo(() => {
        return [
            0,
            ...data.frameList.map((frame) => {
                return frame.timestamp;
            }),
        ];
    }, [data]);

    const jumpBasedOnTime = useCallback(
        (frame: number, direction: 'forward' | 'back') => {
            if (!playerRef.current) {
                return;
            }

            const time = frame / fps;

            const lastIndex = timesOfInterest.findIndex((v) => v >= time);

            const backTime =
                time == timesOfInterest[lastIndex]
                    ? timesOfInterest[lastIndex - 1]
                    : timesOfInterest[lastIndex];
            let outTime = 0;
            if (direction === 'back') {
                if (backTime) outTime = backTime;
            } else {
                outTime = timesOfInterest[lastIndex + 1];
            }
            playerRef.current.seekTo(outTime * fps);
        },
        [playerRef.current, fps]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!playerRef.current) {
                return;
            }

            const player = playerRef.current;

            if (e.code === 'Space') {
                player.isPlaying() ? player.pause() : player.play();
                return;
            }

            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                player.pause();
                jumpBasedOnTime(playerRef.current.getCurrentFrame(), 'back');
                return;
            }

            if (e.code === 'ArrowRight') {
                e.preventDefault();
                player.pause();
                jumpBasedOnTime(playerRef.current.getCurrentFrame(), 'forward');
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playerRef, jumpBasedOnTime]);
};

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
const KNOB_WIDTH = 8;
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
}> = ({ data, width, playerRef }) => {
    const { fps, durationInFrames } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);

    useKeyboardControls(playerRef, data);

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

    return (
        <div
            className={containerStyle}
            ref={containerRef}
            onPointerDown={onPointerDown}
            style={{ width: width + 'px' }}>
            <div className={barBackground}>
                <div
                    style={{
                        width: ((frame - (inFrame ?? 0)) / (durationInFrames - 1)) * 100 + '%',
                        marginLeft: ((inFrame ?? 0) / (durationInFrames - 1)) * 100 + '%',
                    }}
                    className={barFill}
                />
            </div>
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
                    left: Math.max(
                        0,
                        (frame / Math.max(1, durationInFrames - 1)) * width - KNOB_WIDTH / 2
                    ),
                }}
            />
        </div>
    );
};

const TRACKING_DOT_SIZE = 10;
const TrackingDotsTimeLine = ({
    data,
    durationInFrames,
    width,
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
                        style={{ left: dot * width - TRACKING_DOT_SIZE / 2 + 'px' }}
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

const BORDER_WIDTH = 2;

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
    backgroundColor: 'pink.100',
});
