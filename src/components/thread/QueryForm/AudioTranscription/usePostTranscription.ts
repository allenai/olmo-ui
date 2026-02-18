import { apiQueryClient } from '@/api/playgroundApi/v5';

export const usePostTranscription = () => {
    const { mutateAsync } = apiQueryClient.useMutation('post', '/v5/transcription/');

    return async (audioData: Blob) => {
        const fileName = `recording.${new Date().toISOString()}.${audioData.type.split('/')[1]}`;
        const file = new File([audioData], fileName);

        const data = await mutateAsync(
            {
                body: {
                    audio: fileName, // this prop is required here, but ignored/replaced by bodySerializer()
                },
                bodySerializer: () => {
                    const fd = new FormData();
                    fd.append('audio', file);
                    return fd;
                },
            },
            {
                onError: (error) => {
                    console.error('Transcription error', error);
                },
            }
        );

        return data;
    };
};
