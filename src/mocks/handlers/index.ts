import { http, HttpResponse } from 'msw';

import { ModelApiUrl, ModelList } from '../../api/Model';

import { JSONPromptTemplateList, PromptTemplatesApiUrl } from '../../api/PromptTemplate';

import { messageStreamHandlers } from './messageStreamHandlers';
import { User, WhoamiApiUrl } from '../../api/User';
import { Schema, SchemaApiUrl } from '../../api/Schema';

export const handlers = [
    ...messageStreamHandlers,

    http.get(`*${WhoamiApiUrl}`, () => {
        return HttpResponse.json(fakeWhoAmIResponse);
    }),

    http.get(`*${SchemaApiUrl}`, () => {
        return HttpResponse.json(fakeSchemaResponse);
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
};

const fakeSchemaResponse: Schema = {
    Message: {
        InferenceOpts: {
            logprobs: {
                default: null,
                max: 10,
                min: 0,
                name: 'logprobs',
                step: 1,
            },
            max_tokens: {
                default: 2048,
                max: 4096,
                min: 1,
                name: 'max_tokens',
                step: 1,
            },
            n: {
                default: 1,
                max: 50,
                min: 1,
                name: 'n',
                step: 1,
            },
            stop: {
                default: null,
                max: null,
                min: null,
                name: 'stop',
                step: undefined,
            },
            temperature: {
                default: 1,
                max: 2,
                min: 0,
                name: 'temperature',
                step: 0.01,
            },
            top_p: {
                default: 1,
                max: 1,
                min: 0,
                name: 'top_p',
                step: 0.01,
            },
        },
    },
};

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
