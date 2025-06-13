import { css } from '@allenai/varnish-panda-runtime/css';
import { MicRounded, StopCircleOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { errorToAlert } from '@/slices/SnackMessageSlice';

import { handleTranscribe } from './handleTranscribe';
import { useAudioRecording } from './useAudioRecording';

const iconClassName = css({
    transform: 'translateY(1px)', // Microphone looks odd sitting higher than the camera icon
    color: '[currentColor]',
});

interface AudioInputButtonProps {
    onTranscriptionComplete: (content: string) => void;
}

export const AudioInputButton = ({ onTranscriptionComplete }: AudioInputButtonProps) => {
    const { isOLMoASREnabled } = useFeatureToggles();
    const { isTranscribing, addSnackMessage } = useAppContext();
    const { startRecording, stopRecording } = useAudioRecording();

    if (!isOLMoASREnabled) {
        return null;
    }

    const handleAudioClick = async () => {
        if (isTranscribing) {
            stopRecording();
        } else {
            await startRecording({
                pollLength: 1000,
                onStop: async (data) => {
                    try {
                        const { text } = await handleTranscribe(data);
                        onTranscriptionComplete(text);
                    } catch (error: unknown) {
                        addSnackMessage(
                            errorToAlert(
                                `post-transcription-${new Date().getTime()}`.toLowerCase(),
                                `Error making new label.`,
                                error
                            )
                        );
                    }
                },
            });
        }
    };

    const Icon = isTranscribing ? StopCircleOutlined : MicRounded;

    return (
        <IconButton
            onClick={handleAudioClick}
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
