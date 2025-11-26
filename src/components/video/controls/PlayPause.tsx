import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';

import { ControlButton } from './ControlButton';

export const PlayPause = ({
    playing,
    handlePlayPause,
}: {
    playing: boolean;
    handlePlayPause: (e: unknown) => void;
}) => {
    return (
        <ControlButton onPress={handlePlayPause}>
            {playing ? <PauseRounded /> : <PlayArrowRounded />}
        </ControlButton>
    );
};
