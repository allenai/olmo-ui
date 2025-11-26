import { FullscreenRounded } from '@mui/icons-material';
import type { PlayerRef } from '@remotion/player';
import React, { useCallback, useEffect, useState } from 'react';

import { ControlButton } from './ControlButton';

// https://www.remotion.dev/docs/player/custom-controls#fullscreen-button

interface FullScreenButtonProps {
    playerRef: React.RefObject<PlayerRef | null>;
}

export const FullScreenButton = ({ playerRef }: FullScreenButtonProps) => {
    const [supportsFullscreen, setSupportsFullscreen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const { current } = playerRef;

        if (!current) {
            return;
        }

        const onFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        current.addEventListener('fullscreenchange', onFullscreenChange);

        return () => {
            current.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, [playerRef]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const docFullScreen: boolean =
            document.fullscreenEnabled ||
            // @ts-expect-error Types not defined
            document.webkitFullscreenEnabled ||
            false;
        // Must be handled client-side to avoid SSR hydration mismatch
        setSupportsFullscreen(docFullScreen);
    }, []);

    const handleClick = useCallback(() => {
        const { current } = playerRef;
        if (!current) {
            return;
        }

        if (isFullscreen) {
            current.exitFullscreen();
        } else {
            current.requestFullscreen();
        }
    }, [isFullscreen, playerRef]);

    if (!supportsFullscreen) {
        return null;
    }

    return (
        <ControlButton onPress={handleClick}>
            <FullscreenRounded />
        </ControlButton>
    );
};
