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
};

const ControlsContext = createContext<ControlsContextValue | null>(null);

type ControlsProviderProps = {
    playerRef: RefObject<PlayerRef | null>;
    fps: number;
    durationInFrames: number;
    framePoints?: VideoTrackingPoints | VideoFramePoints;
    children: ReactNode;
};

export const ControlsProvider = ({
    playerRef,
    fps,
    durationInFrames,
    framePoints,
    children,
}: ControlsProviderProps) => {
    const value = useMemo<ControlsContextValue>(
        () => ({
            playerRef,
            fps,
            durationInFrames,
            framePoints,
        }),
        [playerRef, fps, durationInFrames, framePoints]
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
