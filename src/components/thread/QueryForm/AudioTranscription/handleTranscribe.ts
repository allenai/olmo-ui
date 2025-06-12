import { playgroundApiQueryClient } from '@/api/playgroundApi/playgroundApiClient';
import { queryClient } from '@/api/query-client';

export const handleTranscribe = async (audioData: Blob) => {
    const fileName = `recording.${audioData.type.split('/')[1]}`;
    const file = new File([audioData], fileName);

    const opts = playgroundApiQueryClient.queryOptions('post', '/v4/transcribe/', {
        body: {},
        bodySerializer() {
            const fd = new FormData();
            fd.append('audio', file);
            return fd;
        },
    });
    return await queryClient.fetchQuery(opts);
};
