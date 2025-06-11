import { css } from '@allenai/varnish-panda-runtime/css';
import { MicRounded, StopCircleOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

// import { IconButton } from '@allenai/varnish-ui'; // styles don't match existing
import { useFeatureToggles } from '@/FeatureToggleContext';

const iconClassName = css({
    transform: 'translateY(1px)', // Microphone looks odd sitting higher than the camera icon
    color: '[currentColor]',
});

interface AudioInputButtonProps {
    isRecording: boolean;
    onClick: () => void;
}

export const AudioInputButton = ({ isRecording, onClick }: AudioInputButtonProps) => {
    const { isOLMoASREnabled } = useFeatureToggles();
    if (!isOLMoASREnabled) {
        return null;
    }

    const Icon = isRecording ? StopCircleOutlined : MicRounded;

    return (
        <IconButton
            onClick={onClick}
            disableRipple={true}
            sx={{
                // style like the FileUploadButton
                padding: 0.5,
                color: 'var(--palette-light-accent-secondary)',
                ':hover': {
                    backgroundColor: 'transparent',
                    color: 'var(--color-teal-100)',
                },
                ':has(:focus-visible)': {
                    outline: '1px solid',
                    borderRadius: 'var(--radii-full, 9999px)',
                },
            }}>
            <Icon className={iconClassName} />
        </IconButton>
    );
};
