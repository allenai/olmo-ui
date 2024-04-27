import { http, HttpResponse, passthrough } from 'msw';

import { Schema, SchemaApiUrl } from '@/api/Schema';

import { WhoamiApiUrl } from '@/api/User';

import { ModelApiUrl, ModelList } from '@/api/Model';

import { JSONPromptTemplateList, PromptTemplatesApiUrl } from '@/api/PromptTemplate';

import { messageStreamHandlers } from './messageStreamHandlers';
import { datasetSearchResponse } from './datasetSearchResponse';

export const handlers = [
    ...messageStreamHandlers,

    http.get(`*${SchemaApiUrl}`, () => {
        return HttpResponse.json(fakeSchemaResponse);
    }),

    http.get(`*${WhoamiApiUrl}`, () => {
        return HttpResponse.json({
            client: 'murphy@allenai.org',
            hasAcceptedTermsAndConditions: true,
        });
    }),

    http.get(`*${ModelApiUrl}`, () => {
        return HttpResponse.json(fakeModelsResponse);
    }),

    http.get(`*${PromptTemplatesApiUrl}`, () => {
        return HttpResponse.json(fakePromptsResponse);
    }),

    http.get(`${process.env.DOLMA_API_URL}/v1/search`, async ({ request }) => {
        const query = new URL(request.url).searchParams.get('query');
        if (query === 'Seattle') {
            console.log('U are here?');
            return HttpResponse.json(datasetSearchResponse);
        }

        return passthrough();
    }),
];

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
                max: 2048,
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
