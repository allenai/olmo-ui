import { http, HttpResponse, passthrough } from 'msw';

import { MigrateFromAnonymousUserUrl, WhoamiApiUrl } from '@/api/User';

import { messageHandlers } from './messageHandlers';
import { messageStreamHandlers } from './messageStreamHandlers';
import { datasetDocumentResponse } from './responses/datasetDocumentResponse';
import { datasetSearchResponse } from './responses/datasetSearchResponse';
import { v5AttributionHandlers } from './v5AttributionHandlers';
import { v5ModelsHandlers } from './v5ModelsHandlers';
import { v5PromptTemplatesHandlers } from './v5PromptTemplatesHandlers';
import { v5ThreadHandlers } from './v5ThreadHandlers';
import { v5TranscriptionHandlers } from './v5TranscriptionHandlers';

export const handlers = [
    ...messageStreamHandlers,
    ...messageHandlers,

    ...v5AttributionHandlers,
    ...v5ThreadHandlers,
    ...v5ModelsHandlers,
    ...v5TranscriptionHandlers,
    ...v5PromptTemplatesHandlers,

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

    http.get(`${process.env.VITE_DOLMA_API_URL}/v1/search`, ({ request }) => {
        const searchParams = new URL(request.url).searchParams;
        const query = searchParams.get('query');
        if (query === 'Seattle') {
            return HttpResponse.json(datasetSearchResponse);
        }

        return passthrough();
    }),

    http.post(`${process.env.VITE_DOLMA_API_URL}/v5/event`, () => {
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
