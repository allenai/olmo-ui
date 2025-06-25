import { OlmoStateCreator } from '@/AppContext';

export interface TranscriptionSlice {
    isTranscribing: boolean;
    setIsTranscribing: (isTranscribing: boolean) => void;
    isProcessingAudio: boolean;
    setIsProcessingAudio: (isProcessingAudio: boolean) => void;
}

export const createTranscriptionSlice: OlmoStateCreator<TranscriptionSlice> = (set) => ({
    // recording audio on client
    isTranscribing: false,
    setIsTranscribing: (isTranscribing: boolean) => {
        set(
            (state) => {
                state.isTranscribing = isTranscribing;
            },
            undefined,
            'transcription/setIsTranscribing'
        );
    },
    // converting audio to text on server
    isProcessingAudio: false,
    setIsProcessingAudio: (isProcessingAudio: boolean) => {
        set(
            (state) => {
                state.isProcessingAudio = isProcessingAudio;
            },
            undefined,
            'transcription/setIsProcessingAudio'
        );
    },
});
