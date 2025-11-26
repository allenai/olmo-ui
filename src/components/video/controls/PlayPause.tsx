import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { memo } from 'react';

import { ControlButton } from './ControlButton';

interface PlayPauseProps {
    playing: boolean;
    handlePlayPause: (e: unknown) => void;
}

export const PlayPause = memo(function PlayPause({ playing, handlePlayPause }: PlayPauseProps) {
    const label = playing ? 'Pause the video' : 'Play the video';

    return (
        <ControlButton onPress={handlePlayPause} aria-label={label}>
            {playing ? <PauseRounded /> : <PlayArrowRounded />}
        </ControlButton>
    );
});
