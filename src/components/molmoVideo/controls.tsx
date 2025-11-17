import { PlayerRef } from '@remotion/player';
import { useCallback, useEffect, useState } from 'react';

export const PlayPauseButton = ({
    playerRef,
}: {
    playerRef: React.RefObject<PlayerRef | null>;
}) => {
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const { current } = playerRef;
        setPlaying(current?.isPlaying() ?? false);
        if (!current) return;

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

    const onToggle = useCallback(() => {
        playerRef.current?.toggle();
    }, [playerRef]);

    return (
        <button onClick={onToggle} type="button">
            {playing ? 'Pause' : 'Play'}
        </button>
    );
};
