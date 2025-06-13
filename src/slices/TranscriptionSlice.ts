import { OlmoStateCreator } from '@/AppContext';

export interface TranscriptionSlice {
    isTranscribing: boolean;
    setIsTranscribing: (isTranscribing: boolean) => void;
}

export const createTranscriptionSlice: OlmoStateCreator<TranscriptionSlice> = (set) => ({
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
});
