import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';

export const handleTranscribe = async (audioData: Blob) => {
    const fileName = `recording.${new Date().toISOString()}.${audioData.type.split('/')[1]}`;
    const file = new File([audioData], fileName);

    const { data, error } = await playgroundApiClient.POST('/v4/transcribe/', {
        body: {
            audio: fileName, // this prop is required here, but ignored/replaced by bodySerializer()
        },
        bodySerializer() {
            const fd = new FormData();
            fd.append('audio', file);
            return fd;
        },
    });
    if (!data) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (error) {
            console.error('Transcription error', error);
        }
        throw new Error('Transcription er');
    }
    return data;
};
