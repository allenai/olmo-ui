import { http, HttpResponse, passthrough } from 'msw';

import { ModelApiUrl, ModelList } from '@/api/Model';
import { JSONPromptTemplateList, PromptTemplatesApiUrl } from '@/api/PromptTemplate';
import { Schema, SchemaApiUrl } from '@/api/Schema';
import { WhoamiApiUrl } from '@/api/User';

import { attributionHandlers } from './attributionHandlers';
import { datasetDocumentResponse } from './datasetDocumentResponse';
import { datasetSearchResponse } from './datasetSearchResponse';
import { dolmaHandlers } from './dolmaHandlers';
import { messageHandlers } from './messageHandlers';
import { messageStreamHandlers } from './messageStreamHandlers';

export const handlers = [
    ...messageStreamHandlers,
    ...dolmaHandlers,
    ...attributionHandlers,
    ...messageHandlers,

    http.get(`${process.env.LLMX_API_URL}${SchemaApiUrl}`, () => {
        return HttpResponse.json(fakeSchemaResponse);
    }),

    http.get(`${process.env.LLMX_API_URL}${WhoamiApiUrl}`, () => {
        return HttpResponse.json({
            client: 'murphy@allenai.org',
            hasAcceptedTermsAndConditions: true,
        });
    }),

    http.get(`${process.env.LLMX_API_URL}${ModelApiUrl}`, () => {
        return HttpResponse.json(fakeModelsResponse);
    }),

    http.get(`${process.env.LLMX_API_URL}${PromptTemplatesApiUrl}`, () => {
        return HttpResponse.json(fakePromptsResponse);
    }),

    http.get(`${process.env.DOLMA_API_URL}/v1/search`, ({ request }) => {
        const searchParams = new URL(request.url).searchParams;
        const query = searchParams.get('query');
        const id = searchParams.get('id');
        if (query === 'Seattle') {
            if (id === 'a718be1486e24cbb7e0aee7d0bef8442') {
                return HttpResponse.json(datasetDocumentResponse);
            }
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
        host: 'togetherai',
        name: 'OLMo 7B - Chat',
        is_deprecated: true,
    },
    {
        description: 'A 70B parameter model that is a fine-tuned version of Llama 2.',
        id: 'tulu2',
        model_type: 'chat',
        host: 'inferd',
        name: 'Tulu2.5',
        is_deprecated: false,
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
