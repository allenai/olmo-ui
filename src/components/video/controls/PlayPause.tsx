import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { memo } from 'react';

import { usePlayback } from './context/usePlayback';
import { ControlButton } from './ControlButton';

export const PlayPause = memo(function PlayPause() {
    const { isPlaying, togglePlayback } = usePlayback();

    const label = isPlaying ? 'Pause the video' : 'Play the video';

    return (
        <ControlButton onPress={togglePlayback} aria-label={label}>
            {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
        </ControlButton>
    );
});
