import { useCallback, useSyncExternalStore } from 'react';

import { useControls } from './ControlsContext';

export const useVolume = () => {
    const { playerRef } = useControls();

    const subscribeVolume = useCallback(
        (onStoreChange: () => void) => {
            const player = playerRef.current;
            if (!player) return () => {};
            player.addEventListener('volumechange', onStoreChange);
            return () => {
                player.removeEventListener('volumechange', onStoreChange);
            };
        },
        [playerRef]
    );

    const subscribeMute = useCallback(
        (onStoreChange: () => void) => {
            const player = playerRef.current;
            if (!player) return () => {};
            player.addEventListener('mutechange', onStoreChange);
            return () => {
                player.removeEventListener('mutechange', onStoreChange);
            };
        },
        [playerRef]
    );

    const getVolume = useCallback(() => playerRef.current?.getVolume() ?? 0, [playerRef]);
    const getIsMuted = useCallback(() => playerRef.current?.isMuted() ?? true, [playerRef]);

    const volume = useSyncExternalStore(subscribeVolume, getVolume);
    const isMuted = useSyncExternalStore(subscribeMute, getIsMuted);

    const setVolume = useCallback(
        (newVolume: number) => playerRef.current?.setVolume(newVolume),
        [playerRef]
    );
    const mute = useCallback(() => playerRef.current?.mute(), [playerRef]);
    const unMute = useCallback(() => playerRef.current?.unmute(), [playerRef]);

    return { volume, isMuted, setVolume, mute, unMute };
};
