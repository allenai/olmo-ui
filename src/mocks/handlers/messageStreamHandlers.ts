import { delay, http, HttpResponse } from 'msw';

import { MessageStreamPart } from '@/api/Message';

import { fakeNewThreadMessages, LOREM_IPSUM_MESSAGE_ID } from './responses/stream/default';
import { fakeFollowupResponse } from './responses/stream/followup';
import { fakeMultiModalStreamMessages } from './responses/stream/multiModal';
import { streamResponseWithSystemMessage } from './responses/stream/withSystemMessage';

const encoder = new TextEncoder();

const formatMessage = (message: unknown) => {
    return JSON.stringify(message) + '\n';
};

export const messageStreamHandlers = [
    http.post(`*/v4/message/stream`, async ({ request }) => {
        const formData = await request.formData();

        const content = formData.get('content');

        let response: MessageStreamPart[];
        if (formData.get('parent') != null) {
            response = fakeFollowupResponse(formData.get('parent') as string);
        } else if (content === 'include system message') {
            response = streamResponseWithSystemMessage;
        } else if (content === 'multimodaltest: Count the boats') {
            response = fakeMultiModalStreamMessages;
        } else {
            response = fakeNewThreadMessages;
        }

        const stream = new ReadableStream({
            async start(controller) {
                if (formData.get('content') === 'infinite') {
                    await delay();
                    controller.enqueue(encoder.encode(formatMessage(response[0])));

                    let responsePosition = 1;
                    let maxRepetitions = 0;
                    while (maxRepetitions < 20) {
                        if (responsePosition === response.length - 1) {
                            responsePosition = 1;
                            maxRepetitions += 1;

                            controller.enqueue(
                                encoder.encode(
                                    formatMessage({
                                        message: LOREM_IPSUM_MESSAGE_ID,
                                        content: ' ',
                                    })
                                )
                            );
                        }

                        await delay(25);
                        controller.enqueue(
                            encoder.encode(formatMessage(response[responsePosition]))
                        );

                        responsePosition++;
                    }

                    await delay(25);
                    controller.enqueue(encoder.encode(formatMessage(response.at(-1))));
                } else {
                    for (const message of response) {
                        await delay();
                        controller.enqueue(encoder.encode(formatMessage(message)));
                    }
                }

                controller.close();
            },
        });

        return new HttpResponse(stream);
    }),
];
