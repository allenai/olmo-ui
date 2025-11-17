import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useMemo } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

export const useKeyboardControls = (
    playerRef: React.RefObject<PlayerRef | null>,
    data: VideoTrackingPoints,
    fps: number,
    durationInFrames: number
) => {
    const timesOfInterest = useMemo(() => {
        const times = [
            ...data.frameList.map((frame) => {
                return frame.timestamp;
            }),
        ];

        if (times[0] !== 0) {
            times.unshift(0);
        }

        if (times[times.length - 1] !== durationInFrames / fps) {
            times.push(durationInFrames / fps);
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

    useEffect(() => {
        // TODO might need to handle focus for multiple controls on screen
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!playerRef.current) {
                return;
            }

            const player = playerRef.current;

            // if (e.code === 'Space') {
            //     player.isPlaying() ? player.pause() : player.play();
            //     return;
            // }

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
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playerRef, jumpBasedOnTime]);
};
