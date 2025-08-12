import { css } from '@allenai/varnish-panda-runtime/css';
import { MicRounded } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { AlertMessageSeverity, errorToAlert, SnackMessageType } from '@/slices/SnackMessageSlice';

import { PromptButton } from '../PromptButton';
import { AcceptOrCancelButtons } from './AcceptOrCancelButtons';
import { DotIndicator } from './DotIndicator';
import { handleTranscribe } from './handleTranscribe';
import { useAudioRecording } from './useAudioRecording';

const iconClassName = css({
    transform: 'translateY(1px)', // Microphone looks odd sitting higher than the camera icon
    color: '[currentColor]',
});

interface AudioInputButtonProps {
    onRecordingBegin?: () => void;
    onRecordingEnd?: () => void;
    onTranscriptionBegin?: () => void;
    onTranscriptionComplete?: (content: string) => void;
    onComplete?: (content?: string | null) => void;
}

export const AudioInputButton = ({
    onRecordingBegin,
    onRecordingEnd,
    onTranscriptionBegin,
    onTranscriptionComplete,
    onComplete,
}: AudioInputButtonProps) => {
    const { isOLMoASREnabled } = useFeatureToggles();
    const { isTranscribing, addSnackMessage, isProcessingAudio, setIsProcessingAudio } =
        useAppContext();
    const { startRecording, stopRecording } = useAudioRecording();

    const cancelRecording = () => {
        stopRecording('userCancel');
    };

    if (!isOLMoASREnabled) {
        return null;
    }

    const pollLength = 1000;
    const maxLength = 25_000;

    const handleAudioClick = async () => {
        if (isTranscribing) {
            stopRecording();
            onComplete?.(null);
        } else {
            try {
                onRecordingBegin?.();
                await startRecording({
                    pollLength,
                    maxLength,
                    onStop: async (data, reason) => {
                        if (reason === 'userCancel') {
                            onComplete?.(null);
                            return;
                        }
                        setIsProcessingAudio(true);
                        if (reason === 'maxLength') {
                            addSnackMessage({
                                id: `audio-transcription-maxLength-${new Date().getTime()}`,
                                message: `max length of ${maxLength / 1000} seconds reached`,
                                severity: AlertMessageSeverity.Info,
                                title: 'Max recording length',
                                type: SnackMessageType.Alert,
                            });
                        }
                        try {
                            onRecordingEnd?.();
                            onTranscriptionBegin?.();
                            const { text } = await handleTranscribe(data);
                            onTranscriptionComplete?.(text);
                            onComplete?.(text);
                        } catch (error: unknown) {
                            addSnackMessage(
                                errorToAlert(
                                    `post-transcription-${new Date().getTime()}`.toLowerCase(),
                                    `Error transcribing speech.`,
                                    error
                                )
                            );
                            onComplete?.(null);
                        } finally {
                            setIsProcessingAudio(false);
                        }
                    },
                });
            } catch (error: unknown) {
                addSnackMessage(
                    errorToAlert(
                        `post-transcription-${new Date().getTime()}`.toLowerCase(),
                        `Error recording audio.`,
                        error
                    )
                );
                onComplete?.(null);
            }
        }
    };

    if (isTranscribing) {
        return (
            <AcceptOrCancelButtons
                stopRecording={stopRecording}
                cancelRecording={cancelRecording}
            />
        );
    }

    if (isProcessingAudio) {
        return <DotIndicator />;
    }

    return (
        <PromptButton onClick={handleAudioClick} disableRipple={true} color="secondary">
            <MicRounded className={iconClassName} />
        </PromptButton>
    );
};
