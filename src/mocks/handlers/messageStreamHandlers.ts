import { delay, http, HttpResponse } from 'msw';

import { MessageStreamPart } from '@/api/Message';
import { Role } from '@/api/Role';

const encoder = new TextEncoder();

export const newMessageId = 'msg_A8E5H1X2O4';
const fakeNewThreadMessages: Array<MessageStreamPart> = [
    {
        id: newMessageId,
        content: 'User message',
        snippet: 'User message',
        creator: 'murphy@allenai.org',
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        created: new Date().toDateString(),
        children: [
            {
                id: 'msg_V6Y0U4H4O9',
                content: '',
                snippet: '',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: new Date().toDateString(),
                parent: newMessageId,
                final: false,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: false,
        private: false,
        labels: [],
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: '',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: '',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Mus ultricies laoreet ex leo ac nulla risus vulputate. Quam euismod dolor fames; tempus habitasse per efficitur rhoncus. Nisi laoreet quam est ante sollicitudin est. Volutpat mi hendrerit habitant curabitur rhoncus dui efficitur. Mauris massa habitant magna non praesent pulvinar laoreet. Enim posuere ex mauris fames lobortis. Eleifend vulputate litora amet semper justo orci odio dolor et. ',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content:
            'Ut varius ante integer netus urna rutrum neque. Fermentum ultrices et mauris nulla lacus venenatis amet nunc massa. Id cras donec euismod dapibus senectus cubilia est dui. Risus auctor luctus, maximus mi nascetur congue. Luctus pellentesque curabitur tortor erat aenean lectus nullam efficitur venenatis. Conubia interdum id vestibulum senectus ligula hendrerit platea. Efficitur varius gravida cubilia molestie conubia.',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content: ' ',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content:
            'Est rutrum penatibus dictumst tristique primis. Porta egestas lacus proin sollicitudin eget elementum eget morbi. Nunc commodo mollis tortor parturient eget imperdiet nam nisl. Aptent posuere ornare parturient nostra feugiat vel. Proin litora tellus volutpat molestie luctus taciti conubia nulla. Platea id ante natoque eu auctor donec. Laoreet accumsan sollicitudin platea, senectus maecenas euismod. Egestas etiam conubia nibh nibh mauris; felis arcu eleifend. Semper orci massa semper finibus enim lacus laoreet.',
    },
    {
        message: 'msg_V6Y0U4H4O9',
        content:
            'Consectetur euismod arcu felis convallis quis, facilisi eget pulvinar ullamcorper. Senectus mus condimentum himenaeos consectetur cubilia, senectus vestibulum. Pretium vehicula class lacus feugiat a curabitur. Lacus dis leo quis sagittis mattis et cubilia enim dapibus. Maximus conubia praesent magnis vulputate a euismod arcu. Posuere phasellus metus sociosqu euismod risus nisl etiam ultrices himenaeos. Praesent ornare tristique ante sem nascetur praesent commodo. Massa efficitur nullam placerat elementum tempor vitae rhoncus. Tempus suscipit montes pulvinar dis urna eget molestie.',
    },
    {
        id: newMessageId,
        content: 'User message',
        snippet: 'User message',
        creator: 'murphy@allenai.org',
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        created: new Date().toDateString(),
        children: [
            {
                id: 'msg_V6Y0U4H4O9',
                content: 'This is the first response.',
                snippet: 'This is the first response.',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: new Date().toDateString(),
                parent: newMessageId,
                logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: true,
        private: false,
        labels: [],
    },
];

export const followupUserMessageId = 'msg_G8D2Q9Y8Q7';
const followupLLMMessageId = 'msg_V6Y0U4H414';
const fakeFollowupResponse = (parentId: string): Array<MessageStreamPart> => [
    {
        id: followupUserMessageId,
        content: 'Second user message',
        snippet: 'Second user message',
        creator: 'murphy@allenai.org',
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        parent: parentId,
        created: '2024-03-20T22:34:03.329111+00:00',
        children: [
            {
                id: followupLLMMessageId,
                content: '',
                snippet: '',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: followupUserMessageId,
                final: false,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: false,
        private: false,
        labels: [],
    },
    {
        message: followupLLMMessageId,
        content: '',
    },
    {
        message: followupLLMMessageId,
        content: '',
    },
    {
        message: followupLLMMessageId,
        content: 'This ',
    },
    {
        message: followupLLMMessageId,
        content: 'is ',
    },
    {
        message: followupLLMMessageId,
        content: '',
    },
    {
        message: followupLLMMessageId,
        content: 'the ',
    },
    {
        message: followupLLMMessageId,
        content: 'second response.',
    },
    {
        id: followupUserMessageId,
        content: 'Second user message',
        snippet: 'Second user message',
        creator: 'murphy@allenai.org',
        parent: parentId,
        role: Role.User,
        opts: {
            max_tokens: 2048,
            temperature: 1,
            n: 1,
            top_p: 1,
        },
        root: newMessageId,
        created: '2024-03-20T22:34:03.329111+00:00',
        children: [
            {
                id: followupLLMMessageId,
                content: 'This is the second response.',
                snippet: 'OkayOkayOkayOkayOkayOkayOkayOkayOkay',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    max_tokens: 2048,
                    temperature: 1,
                    n: 1,
                    top_p: 1,
                },
                root: newMessageId,
                created: '2024-03-20T22:34:03.342086+00:00',
                parent: followupUserMessageId,
                logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                model_type: 'chat',
                labels: [],
            },
        ],
        final: true,
        private: false,
        labels: [],
    },
];

export const messageStreamHandlers = [
    http.post(`*/v3/message/stream`, async ({ request }) => {
        const requestBody = (await request.json()) as Record<string, unknown>;

        // if this is a follow up to a thread use the thread response
        const response =
            requestBody.parent != null
                ? fakeFollowupResponse(requestBody.parent as string)
                : fakeNewThreadMessages;

        const stream = new ReadableStream({
            async start(controller) {
                if (requestBody.content === 'infinite') {
                    controller.enqueue(encoder.encode(JSON.stringify(response[0]) + '\n'));
                    let responsePosition = 1;
                    let maxRepetitions = 0;
                    while (maxRepetitions < 20) {
                        if (responsePosition === response.length - 1) {
                            responsePosition = 1;
                            maxRepetitions += 1;

                            controller.enqueue(
                                encoder.encode(
                                    JSON.stringify({
                                        message: 'msg_V6Y0U4H4O9',
                                        content: ' ',
                                    }) + '\n'
                                )
                            );
                        }

                        await delay(25);
                        controller.enqueue(
                            encoder.encode(JSON.stringify(response[responsePosition]) + '\n')
                        );

                        responsePosition++;
                    }

                    await delay(25);
                    controller.enqueue(encoder.encode(JSON.stringify(response.at(-1)) + '\n'));
                } else {
                    for (const message of response) {
                        await delay();
                        controller.enqueue(encoder.encode(JSON.stringify(message) + '\n'));
                    }
                }

                controller.close();
            },
        });

        return new HttpResponse(stream);
    }),
];
