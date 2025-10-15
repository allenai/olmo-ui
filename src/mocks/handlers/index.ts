import { http, HttpResponse, passthrough } from 'msw';

import { JSONPromptTemplateList, PromptTemplatesApiUrl } from '@/api/PromptTemplate';
import { MigrateFromAnonymousUserUrl, WhoamiApiUrl } from '@/api/User';

import {} from './';
import { attributionHandlers } from './attributionHandlers';
import { messageHandlers } from './messageHandlers';
import { messageStreamHandlers } from './messageStreamHandlers';
import { datasetDocumentResponse } from './responses/datasetDocumentResponse';
import { datasetSearchResponse } from './responses/datasetSearchResponse';
import { v4ModelsHandlers } from './v4ModelsHandlers';
import { v4PromptTemplatesHandlers } from './v4PromptTemplatesHandlers';
import { v4ThreadHandlers } from './v4ThreadHandlers';
import { v4TranscriptionHandlers } from './v4TranscriptionHandlers';

export const handlers = [
    ...messageStreamHandlers,
    ...attributionHandlers,
    ...messageHandlers,
    ...v4ThreadHandlers,
    ...v4ModelsHandlers,
    ...v4TranscriptionHandlers,
    ...v4PromptTemplatesHandlers,

    http.get(`${process.env.VITE_API_URL}${WhoamiApiUrl}`, () => {
        return HttpResponse.json({
            client: 'murphy@allenai.org',
            hasAcceptedTermsAndConditions: true,
            permissions: [],
        });
    }),

    http.put(`${process.env.VITE_API_URL}${MigrateFromAnonymousUserUrl}`, () => {
        return HttpResponse.json({
            updated_user: {
                client: 'murphy@allenai.org',
                hasAcceptedTermsAndConditions: true,
            },
            messages_updated_count: 0,
        });
    }),

    http.get(`${process.env.VITE_API_URL}${PromptTemplatesApiUrl}`, () => {
        return HttpResponse.json(fakePromptsResponse);
    }),

    http.get(`${process.env.VITE_DOLMA_API_URL}/v1/search`, ({ request }) => {
        const searchParams = new URL(request.url).searchParams;
        const query = searchParams.get('query');
        if (query === 'Seattle') {
            return HttpResponse.json(datasetSearchResponse);
        }

        return passthrough();
    }),

    http.post(`${process.env.VITE_DOLMA_API_URL}/v1/event`, () => {
        return new HttpResponse(undefined, { status: 200 });
    }),

    http.get(
        `${process.env.VITE_DOLMA_API_URL}/v1/document/a718be1486e24cbb7e0aee7d0bef8442`,
        ({ request }) => {
            const searchParams = new URL(request.url).searchParams;
            const query = searchParams.get('query');
            if (query === 'Seattle') {
                return HttpResponse.json(datasetDocumentResponse);
            }
            return HttpResponse.json(datasetDocumentResponse);
        }
    ),
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
