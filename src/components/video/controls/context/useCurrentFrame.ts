import type { PlayerRef } from '@remotion/player';
import { type RefObject, useCallback, useSyncExternalStore } from 'react';

import { useControls } from './ControlsContext';

//
// uses react useSyncExternalStore to sync events from player to hook
//
// Adapted from: https://www.remotion.dev/docs/player/current-time
//
export const usePlayerCurrentFrame = (playerRef: RefObject<PlayerRef | null>) => {
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            const player = playerRef.current;
            if (!player) return () => {};
            player.addEventListener('frameupdate', onStoreChange);
            return () => {
                player.removeEventListener('frameupdate', onStoreChange);
            };
        },
        [playerRef]
    );

    const getSnapshot = useCallback(() => {
        return playerRef.current?.getCurrentFrame() ?? 0;
    }, [playerRef]);

    return useSyncExternalStore(subscribe, getSnapshot);
};

export const useCurrentFrame = () => {
    const { playerRef } = useControls();
    return usePlayerCurrentFrame(playerRef);
};
