import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { memo } from 'react';

import { useControls } from './context/ControlsContext';
import { usePlayback } from './context/usePlayback';
import { ControlButton } from './ControlButton';

export const PlayPause = memo(function PlayPause() {
    const { isDisabled } = useControls();
    const { isPlaying, togglePlayback } = usePlayback();

    const label = isPlaying ? 'Pause the video' : 'Play the video';

    return (
        <ControlButton isDisabled={isDisabled} onPress={togglePlayback} aria-label={label}>
            {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
        </ControlButton>
    );
});
