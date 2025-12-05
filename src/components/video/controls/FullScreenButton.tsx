import { FullscreenRounded } from '@mui/icons-material';
import { memo, useCallback, useEffect, useState } from 'react';

import { useControls } from './context/ControlsContext';
import { ControlButton } from './ControlButton';

interface FullScreenButtonProps {
    onChange?: (isFullScreen: boolean) => void;
}

// https://www.remotion.dev/docs/player/custom-controls#fullscreen-button
export const FullScreenButton = memo(function FullScreenButton({
    onChange,
}: FullScreenButtonProps) {
    const { playerRef } = useControls();
    const [supportsFullscreen, setSupportsFullscreen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const player = playerRef.current;

        if (!player) {
            return;
        }

        const onFullscreenChange = () => {
            const documentIsFullscreen = document.fullscreenElement !== null;
            setIsFullscreen(documentIsFullscreen);
            onChange?.(documentIsFullscreen);
        };

        player.addEventListener('fullscreenchange', onFullscreenChange);

        return () => {
            player.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, [playerRef, onChange]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const docFullScreen: boolean =
            document.fullscreenEnabled ||
            // @ts-expect-error Types not defined
            document.webkitFullscreenEnabled ||
            false;

        setSupportsFullscreen(docFullScreen);
    }, []);

    const handleClick = useCallback(() => {
        const player = playerRef.current;
        if (!player) {
            return;
        }

        if (isFullscreen) {
            player.exitFullscreen();
        } else {
            player.requestFullscreen();
        }
    }, [isFullscreen, playerRef]);

    if (!supportsFullscreen) {
        return null;
    }

    return (
        <ControlButton onPress={handleClick} aria-label="Toggle fullscreen">
            <FullscreenRounded />
        </ControlButton>
    );
});
