import { useRef } from 'react';

import { useAppContext } from '@/AppContext';

type StreamState = 'idle' | 'init';

interface UseAudioRecordingProps {
    debug?: boolean;
}

interface StartRecordingProps {
    pollLength: number;
    onData?: (data: Blob) => Promise<void>;
    onStop?: (data: Blob) => Promise<void>;
    onError?: (event: Event) => void;
}

export const useAudioRecording = (opts: UseAudioRecordingProps = {}) => {
    // UI state -- needed for icon and QueryForm submit
    const setIsTranscribing = useAppContext((state) => state.setIsTranscribing);

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
                        debugLog('Audio chunk received, size:', event.data.size);
                        if (onData) {
                            await onData(event.data);
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
                        await onStop(audioBlob);
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

    const stopRecording = (): void => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
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
