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
                // @ts-expect-error - Readonly error, something funky with WriteableDraft and readonly
                // It's OK for us to overwrite here so we can ignore this safely
                state.isTranscribing = isTranscribing;
            },
            undefined,
            'model/setSelectedModel'
        );
    },
});
