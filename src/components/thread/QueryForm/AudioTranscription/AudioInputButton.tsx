import { css } from '@allenai/varnish-panda-runtime/css';
import { MicRounded, StopCircleOutlined } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, IconButtonProps, Stack, styled, Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

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

    const cancelButton = (
        <PromptButton
            onClick={() => {
                cancelRecording();
            }}
            disableRipple={true}
            color="default"
            size="medium"
            sx={{
                color: 'var(--palette-light-text-default)',
                ':hover': {
                    color: 'var(--palette-light-accent-secondary)',
                },
            }}>
            <CloseIcon fontSize="small" />
        </PromptButton>
    );
    const acceptButton = (
        <PromptButton
            onClick={() => {
                stopRecording();
            }}
            disableRipple={true}
            color="secondary"
            size="medium">
            <CheckIcon fontSize="small" />
        </PromptButton>
    );

    if (isTranscribing) {
        return (
            <>
                {cancelButton}
                {acceptButton}
            </>
        );
    }

    return (
        <PromptButton
            onClick={handleAudioClick}
            disableRipple={true}
            color="secondary"
            sx={{
                cursor: isProcessingAudio ? 'default' : 'hand',
            }}>
            {isProcessingAudio ? (
                <StyledTooltip title="Transcribing Audio. Please wait." placement="top">
                    <CircularProgress size="1.5rem" color="secondary" />
                </StyledTooltip>
            ) : isTranscribing ? (
                <StopCircleOutlined className={iconClassName} />
            ) : (
                <MicRounded className={iconClassName} />
            )}
        </PromptButton>
    );
};

const PromptButton = styled(IconButton)({
    padding: 0.5,
    width: '32px',
    color: 'var(--palette-light-accent-secondary)',
    ':hover': {
        backgroundColor: 'transparent',
        color: 'var(--color-teal-100)',
    },
    ':has(:focus-visible)': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },
});
