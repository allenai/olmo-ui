import type { PlayerRef } from '@remotion/player';
import { createContext, type ReactNode, type RefObject, useContext, useMemo } from 'react';

import type {
    VideoFramePoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

type ControlsContextValue = {
    playerRef: RefObject<PlayerRef | null>;
    durationInFrames: number;
    fps: number;
    framePoints?: VideoTrackingPoints | VideoFramePoints;
    isDisabled?: boolean;
};

const ControlsContext = createContext<ControlsContextValue | null>(null);

type ControlsProviderProps = {
    playerRef: RefObject<PlayerRef | null>;
    fps: number;
    durationInFrames: number;
    framePoints?: VideoTrackingPoints | VideoFramePoints;
    isDisabled?: boolean;
    children: ReactNode;
};

export const ControlsProvider = ({
    playerRef,
    fps,
    durationInFrames,
    framePoints,
    isDisabled,
    children,
}: ControlsProviderProps) => {
    const value = useMemo<ControlsContextValue>(
        () => ({
            playerRef,
            fps,
            durationInFrames,
            framePoints,
            isDisabled,
        }),
        [playerRef, fps, durationInFrames, framePoints, isDisabled]
    );

    return <ControlsContext.Provider value={value}>{children}</ControlsContext.Provider>;
};

export const useControls = () => {
    const ctx = useContext(ControlsContext);
    if (!ctx) {
        throw new Error('useControls must be used within ControlsProvider');
    }
    return ctx;
};
