import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { memo } from 'react';

import { ControlButton } from './ControlButton';

export const PlayPause = memo(function PlayPause({
    playing,
    handlePlayPause,
}: {
    playing: boolean;
    handlePlayPause: (e: unknown) => void;
}) {
    const label = playing ? 'Pause the video' : 'Play the video';

    return (
        <ControlButton onPress={handlePlayPause} aria-label={label}>
            {playing ? <PauseRounded /> : <PlayArrowRounded />}
        </ControlButton>
    );
});
