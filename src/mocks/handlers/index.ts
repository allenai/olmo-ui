import { http, HttpResponse } from 'msw';

import { ModelApiUrl, ModelList } from '../../api/Model';

import { JSONPromptTemplateList, PromptTemplatesApiUrl } from '../../api/PromptTemplate';

import { messageStreamHandlers } from './messageStreamHandlers';
import { User, WhoamiApiUrl } from '../../api/User';

export const handlers = [
    ...messageStreamHandlers,

    http.get(`*${WhoamiApiUrl}`, () => {
        return HttpResponse.json(fakeWhoAmIResponse);
    }),

    http.get(`*${ModelApiUrl}`, () => {
        return HttpResponse.json(fakeModelsResponse);
    }),

    http.get(`*${PromptTemplatesApiUrl}`, () => {
        return HttpResponse.json(fakePromptsResponse);
    }),
];

const fakeWhoAmIResponse: User = {
    client: 'murphy@allenai.org',
}

const fakeModelsResponse: ModelList = [
    {
        description: "AI2's 7B model trained on the Dolma dataset and fine-tuned for chat.",
        id: 'olmo-7b-chat',
        model_type: 'chat',
        name: 'OLMo 7B - Chat',
    },
    {
        description: "AI2's 7B model trained on the Dolma dataset.",
        id: 'olmo-7b-base',
        model_type: 'base',
        name: 'OLMo 7B - Base',
    },
];
const fakePromptsResponse: JSONPromptTemplateList = [
    {
        id: 'id',
        name: 'name',
        content: 'This is a prompt template',
        creator: 'creator',
        created: '1710371316729',
    },
];
