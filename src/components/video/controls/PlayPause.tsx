import { css } from '@allenai/varnish-panda-runtime/css';
import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { Button } from 'react-aria-components';

const playPauseButton = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1',
    backgroundColor: 'accent.primary',
    borderStyle: 'solid',
    borderWidth: '2',
    borderColor: 'elements.primary.stroke',
    color: 'white',
    borderRadius: 'full',
    cursor: 'pointer',
    transition: '[all 0.2s]',
    _hover: {
        backgroundColor: 'elements.primary.hovered.fill',
    },
});

export const PlayPause = ({
    playing,
    handlePlayPause,
}: {
    playing: boolean;
    handlePlayPause: (e: unknown) => void;
}) => {
    return (
        <Button className={playPauseButton} onPress={handlePlayPause}>
            {playing ? <PauseRounded /> : <PlayArrowRounded />}
        </Button>
    );
};
