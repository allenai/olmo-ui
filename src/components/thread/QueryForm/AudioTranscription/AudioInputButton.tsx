import { css } from '@allenai/varnish-panda-runtime/css';
import { MicRounded, StopCircleOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { useAppContext } from '@/AppContext';
import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { AlertMessageSeverity, errorToAlert, SnackMessageType } from '@/slices/SnackMessageSlice';

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
}

export const AudioInputButton = ({
    onRecordingBegin,
    onRecordingEnd,
    onTranscriptionBegin,
    onTranscriptionComplete,
}: AudioInputButtonProps) => {
    const { isOLMoASREnabled } = useFeatureToggles();
    const { isTranscribing, addSnackMessage, isProcessingAudio, setIsProcessingAudio } =
        useAppContext();
    const { startRecording, stopRecording } = useAudioRecording();

    if (!isOLMoASREnabled) {
        return null;
    }

    const pollLength = 1000;
    const maxLength = 25_000;

    const handleAudioClick = async () => {
        if (isTranscribing) {
            stopRecording();
        } else {
            try {
                onRecordingBegin?.();
                await startRecording({
                    pollLength,
                    maxLength,
                    onStop: async (data, reason) => {
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
                        } catch (error: unknown) {
                            addSnackMessage(
                                errorToAlert(
                                    `post-transcription-${new Date().getTime()}`.toLowerCase(),
                                    `Error transcribing speech.`,
                                    error
                                )
                            );
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
            }
        }
    };

    let tooltipText = 'Press record to start recording audio for transcription with OLMoASR';

    if (isTranscribing) {
        tooltipText =
            'OLMoASR is listening and transcribing. Press stop when you’re done speaking..';
    }
    if (isProcessingAudio) {
        tooltipText = 'Transcribing Audio. Please wait.';
    }

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
                cursor: isProcessingAudio ? 'default' : 'hand',
            }}>
            <StyledTooltip title={tooltipText} placement="top">
                {isProcessingAudio ? (
                    <CircularProgress size="1.5rem" color="inherit" />
                ) : isTranscribing ? (
                    <StopCircleOutlined className={iconClassName} />
                ) : (
                    <MicRounded className={iconClassName} />
                )}
            </StyledTooltip>
        </IconButton>
    );
};
