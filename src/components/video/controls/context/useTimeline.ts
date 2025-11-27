import { useCallback } from 'react';

import { useOnKeyDownControls } from '../useOnKeyDownControls';
import { useControls } from './ControlsContext';

export const useTimeline = () => {
    const { playerRef, fps, durationInFrames, framePoints } = useControls();

    const seekTo = useCallback((frame: number) => playerRef.current?.seekTo(frame), [playerRef]);

    const { handleKeyDown, jumpBasedOnTime, jumpBasedOnCurrent } = useOnKeyDownControls(
        playerRef,
        framePoints,
        fps,
        durationInFrames
    );

    return {
        fps,
        durationInFrames,
        seekTo,
        jumpBasedOnTime,
        jumpBasedOnCurrent,
        handleKeyDown,
    };
};
