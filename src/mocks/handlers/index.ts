import { http, HttpResponse, passthrough } from 'msw';

import { staticData } from '@/api/dolma/staticData';
import { ModelApiUrl, ModelList } from '@/api/Model';
import { JSONPromptTemplateList, PromptTemplatesApiUrl } from '@/api/PromptTemplate';
import { Schema, SchemaApiUrl } from '@/api/Schema';
import { WhoamiApiUrl } from '@/api/User';

import { datasetDocumentResponse } from './datasetDocumentResponse';
import { datasetSearchResponse } from './datasetSearchResponse';
import { messageStreamHandlers } from './messageStreamHandlers';

export const handlers = [
    ...messageStreamHandlers,

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

    http.get(`${process.env.DOLMA_API_URL}/static/sources.json`, () => {
        return HttpResponse.json(fakeSources);
    }),

    http.get(`${process.env.DOLMA_API_URL}/static/source_counts/data.json`, () => {
        return HttpResponse.json(fakeSourceCount);
    }),

    http.get(`${process.env.DOLMA_API_URL}/static/domains/data.json`, () => {
        return HttpResponse.json(fakeDomains);
    }),

    http.get(`${process.env.DOLMA_API_URL}/v1/meta`, () => {
        return HttpResponse.json(fakeCount);
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

const fakeSources: staticData.Sources = {
    c4: {
        label: 'C4',
        order: 1,
        color: '#B5F0FF',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Domains,
            staticData.StaticDataType.Created,
            staticData.StaticDataType.SourceCounts,
        ],
    },
    'common-crawl': {
        label: 'Common Crawl',
        order: 0,
        color: '#FF9F9E',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Domains,
            staticData.StaticDataType.Created,
            staticData.StaticDataType.SourceCounts,
        ],
    },
    gutenberg: {
        label: 'Gutenberg',
        order: 4,
        color: '#E7A2DE',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Created,
            staticData.StaticDataType.SourceCounts,
        ],
    },
    reddit: {
        label: 'Reddit',
        order: 3,
        color: '#70DDBA',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Domains,
            staticData.StaticDataType.Created,
            staticData.StaticDataType.SourceCounts,
        ],
    },
    s2: {
        label: 'Semantic Scholar (pes2o)',
        order: 5,
        color: '#9AE7EC',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Domains,
            staticData.StaticDataType.Created,
            staticData.StaticDataType.SourceCounts,
        ],
    },
    'stack-dedup': {
        label: 'Stack Dedup',
        order: 6,
        color: '#FFD45D',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Domains,
            staticData.StaticDataType.SourceCounts,
        ],
    },
    wikipedia: {
        label: 'Wikipedia',
        order: 2,
        color: '#B7AFEB',
        staticData: [
            staticData.StaticDataType.Words,
            staticData.StaticDataType.Domains,
            staticData.StaticDataType.Created,
            staticData.StaticDataType.SourceCounts,
        ],
    },
};

const fakeSourceCount: staticData.SourceCounts = {
    'common-crawl': 4015043327,
    reddit: 377472855,
    c4: 364156258,
    'stack-dedup': 210879754,
    s2: 36921191,
    wikipedia: 6023854,
    gutenberg: 54489,
};

const fakeCount = {
    count: 3103760832,
};

const fakeDomains: staticData.DomainsBySource = {
    wikipedia: {
        'en.wikipedia.org': 5829258,
        'simple.wikipedia.org': 125612,
        'en.wikibooks.org': 68614,
        'simple.wikibooks.org': 370,
    },
    s2: {
        'semanticscholar.org': 36921191,
    },
    reddit: {
        'reddit.com': 330967530,
    },
    'stack-dedup': {
        'github.com': 210879754,
    },
};
