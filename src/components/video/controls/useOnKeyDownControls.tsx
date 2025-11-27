import type { PlayerRef } from '@remotion/player';
import React, { KeyboardEventHandler, useCallback, useMemo } from 'react';

import { VideoFramePoints, VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

type JumpDirection = 'forward' | 'back';

export type JumpBasedOnCurrentFn = (direction: JumpDirection) => void;

type UseOnKeyDownControlsReturn = {
    handleKeyDown: KeyboardEventHandler<HTMLElement>;
    jumpBasedOnTime: (frame: number, direction: JumpDirection) => void;
    jumpBasedOnCurrent: JumpBasedOnCurrentFn;
};

export const useOnKeyDownControls = (
    playerRef: React.RefObject<PlayerRef | null>,
    data: VideoTrackingPoints | VideoFramePoints | undefined,
    fps: number,
    durationInFrames: number,
    disableSpace: boolean = false
): UseOnKeyDownControlsReturn => {
    const timesOfInterest = useMemo(() => {
        const times = data
            ? [
                  ...data.frameList.map((frame) => {
                      return frame.timestamp;
                  }),
              ]
            : [];

        if (times[0] !== 0) {
            times.unshift(0);
        }

        if (times[times.length - 1] !== (durationInFrames - 1) / fps) {
            times.push((durationInFrames - 1) / fps);
        }

        return times;
    }, [data, durationInFrames, fps]);

    const jumpBasedOnTime = useCallback(
        (frame: number, direction: 'forward' | 'back') => {
            if (!playerRef.current) {
                return;
            }

            const time = frame / fps;

            const lastIndex = timesOfInterest.findIndex((v) => v >= time);

            let outTime = 0;

            if (direction === 'back') {
                const backTime = timesOfInterest[lastIndex - 1];
                if (backTime) outTime = backTime;
            } else {
                const move = time === timesOfInterest[lastIndex] ? lastIndex + 1 : lastIndex;
                const nextIndex = Math.min(move, timesOfInterest.length - 1);
                outTime = timesOfInterest[nextIndex];
            }
            playerRef.current.seekTo(outTime * fps);
        },
        [playerRef, fps, timesOfInterest]
    );

    const jumpBasedOnCurrent: JumpBasedOnCurrentFn = useCallback(
        (direction: 'forward' | 'back') => {
            if (!playerRef.current) {
                return;
            }
            const player = playerRef.current;
            player.pause();
            jumpBasedOnTime(player.getCurrentFrame(), direction);
        },
        [playerRef, jumpBasedOnTime]
    );

    const handleKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!playerRef.current) {
                return;
            }

            const player = playerRef.current;

            if (e.code === 'Space' && !disableSpace) {
                if (player.isPlaying()) {
                    player.pause();
                } else {
                    player.play();
                }
                return;
            }

            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                player.pause();
                jumpBasedOnTime(player.getCurrentFrame(), 'back');
                return;
            }

            if (e.code === 'ArrowRight') {
                e.preventDefault();
                player.pause();
                jumpBasedOnTime(player.getCurrentFrame(), 'forward');
            }
        },
        [playerRef, jumpBasedOnTime, disableSpace]
    );

    return {
        handleKeyDown,
        jumpBasedOnTime,
        jumpBasedOnCurrent,
    };
};
