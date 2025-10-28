import { delay } from 'msw';

import type { StreamingMessageResponse } from '@/contexts/stream-types';

export const formatStreamMessage = (message: StreamingMessageResponse) => {
    return JSON.stringify(message) + '\n';
};

const encoder = new TextEncoder();

export const createStreamFromResponse = (
    response: StreamingMessageResponse[],
    delayDurationOrMode?: Parameters<typeof delay>['0']
) => {
    const stream = new ReadableStream({
        async start(controller) {
            for (const message of response) {
                await delay(delayDurationOrMode);
                controller.enqueue(encoder.encode(formatStreamMessage(message)));
            }

            controller.close();
        },
    });

    return stream;
};
