import { useCallback, useSyncExternalStore } from 'react';

import { useControls } from './ControlsContext';

export const usePlayback = () => {
    const { playerRef } = useControls();

    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            const player = playerRef.current;
            if (!player) return () => {};
            player.addEventListener('play', onStoreChange);
            player.addEventListener('pause', onStoreChange);
            return () => {
                player.removeEventListener('play', onStoreChange);
                player.removeEventListener('pause', onStoreChange);
            };
        },
        [playerRef]
    );

    const getSnapshot = useCallback(() => {
        return playerRef.current?.isPlaying() ?? false;
    }, [playerRef]);

    const isPlaying = useSyncExternalStore(subscribe, getSnapshot);

    const play = useCallback(() => playerRef.current?.play(), [playerRef]);
    const pause = useCallback(() => playerRef.current?.pause(), [playerRef]);
    const togglePlayback = useCallback(() => {
        if (playerRef.current?.isPlaying()) {
            playerRef.current.pause();
        } else {
            playerRef.current?.play();
        }
    }, [playerRef]);

    return { isPlaying, play, pause, togglePlayback };
};
