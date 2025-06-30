import { useRef } from 'react';

import { useAppContext } from '@/AppContext';

type StreamState = 'idle' | 'init';
type StopReason = 'user' | 'maxLength' | 'unknown';

interface UseAudioRecordingProps {
    debug?: boolean;
}

interface StartRecordingProps {
    pollLength?: number;
    maxLength?: number;
    onData?: (data: Blob) => Promise<void>;
    onStop?: (data: Blob, reason?: StopReason) => Promise<void>;
    onError?: (event: Event) => void;
}

export const useAudioRecording = (opts: UseAudioRecordingProps = {}) => {
    // UI state -- needed for icon and QueryForm submit
    const setIsTranscribing = useAppContext((state) => state.setIsTranscribing);
    const stopReason = useRef<StopReason>('unknown');

    // Stream aquire state
    const streamState = useRef<StreamState>('idle');

    const mediaStream = useRef<MediaStream | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const debugLog = (...args: unknown[]) => {
        if (opts.debug) {
            console.debug(...args);
        }
    };

    const startRecording = async ({
        pollLength = 1_000,
        maxLength = 25_000,
        onData,
        onStop,
        onError,
    }: StartRecordingProps): Promise<void> => {
        try {
            debugLog('Attempting to start recording...');

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia is not supported in this browser');
            }

            if (streamState.current === 'idle') {
                debugLog('Aquiring audio stream...');
                streamState.current = 'init';
                mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                debugLog('Audio stream obtained:', mediaStream.current);
                stopReason.current = 'unknown';
            }

            if (mediaStream.current) {
                // Check for supported MIME types
                // prefered order
                const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
                const selectedMimeType =
                    mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

                if (!selectedMimeType) {
                    throw new Error('No supported MIME type found for MediaRecorder');
                }

                debugLog('Using MIME type:', selectedMimeType);

                mediaRecorder.current = new MediaRecorder(mediaStream.current, {
                    mimeType: selectedMimeType,
                    audioBitsPerSecond: 128_000,
                });
                debugLog('MediaRecorder created:', mediaRecorder.current);

                audioChunks.current = [];

                mediaRecorder.current.ondataavailable = async (event: BlobEvent) => {
                    if (event.data.size > 0) {
                        audioChunks.current.push(event.data);
                        const totalLength = audioChunks.current.length * pollLength;

                        debugLog('Audio chunk received, size:', event.data.size);
                        if (onData) {
                            await onData(event.data);
                        }

                        if (totalLength >= maxLength) {
                            stopRecording('maxLength');
                        }
                    }
                };

                mediaRecorder.current.onstop = async () => {
                    debugLog('MediaRecorder stopped');
                    const audioBlob = new Blob(audioChunks.current, { type: selectedMimeType });
                    debugLog('Audio blob created, size:', audioBlob.size);
                    mediaStream.current?.getTracks().forEach((track) => {
                        track.stop();
                    });
                    if (onStop) {
                        await onStop(audioBlob, stopReason.current);
                    }
                };

                mediaRecorder.current.onerror = (event: Event) => {
                    debugLog('MediaRecorder error', event);
                    if (onError) {
                        onError(event);
                    }
                };

                mediaRecorder.current.start(pollLength);
                debugLog('MediaRecorder started');
                setIsTranscribing(true);
            }
        } catch (error: unknown) {
            console.error('Error starting recording:', error);
            streamState.current = 'idle';
            setIsTranscribing(false);
            throw error;
        }
    };

    const stopRecording = (reason: StopReason = 'user'): void => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            stopReason.current = reason;
            debugLog('Stopping MediaRecorder');
            mediaRecorder.current.stop();
            streamState.current = 'idle';
            setIsTranscribing(false);
        } else {
            debugLog('MediaRecorder not active, cannot stop');
        }
    };

    return {
        startRecording,
        stopRecording,
    };
};
