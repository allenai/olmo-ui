import { SchemaAttributionResponse } from '@/api/playgroundApi/v5playgroundApiSchema';

import documentWithMultipleSnippetsResponse from './responses/v5/attribution/documentWithMultipleSnippetsAttributionResponse';
import duplicateDocumentsResponse from './responses/v5/attribution/duplicateDocumentAttributionResponse';
import highlightStressTestResponse from './responses/v5/attribution/highlightStressTestResponse';
import overlappingSpansResponse from './responses/v5/attribution/overlappingSpansAttributionResponse';
import { v5TypedHttp } from './v5TypedHttp';

const fakeAttributionResponse = {
    documents: [
        {
            correspondingSpans: [0],
            correspondingSpanTexts: ['OkayOkayOkayOkayOkayOkayOkayOkay', 'OkayOkay'],
            index: '2132419686',
            source: 'c4',
            textLong:
                "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
            // text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
            snippets: [
                {
                    text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
                    correspondingSpanText: 'OkayOkayOkayOkayOkayOkayOkayOkay',
                },
                {
                    text: 'some text surrounding OkayOkay end surrounding',
                    correspondingSpanText: 'OkayOkay',
                },
            ],
            title: null,
            usage: null,
            displayName: null,
            sourceUrl: null,
            relevanceScore: 0,
        },
        {
            correspondingSpans: [1],
            correspondingSpanTexts: ['OkayOkay'],
            index: '2132419687',
            source: 'c4',
            // text: 'some text surrounding OkayOkay end surrounding',
            snippets: [
                {
                    text: 'some text surrounding OkayOkay end surrounding',
                    correspondingSpanText: 'OkayOkay',
                },
            ],
            title: null,
            textLong: 'some text surrounding OkayOkay end surrounding',
            usage: null,
            displayName: null,
            sourceUrl: null,
            relevanceScore: 0,
        },
    ],
    spans: [
        {
            documents: [2132419686],
            nestedSpans: [
                {
                    documents: [2132419686],
                    text: 'OkayOkayOkayOkayOkayOkayOkayOkay',
                    startIndex: 0,
                },
            ],
            text: 'OkayOkayOkayOkayOkayOkayOkayOkay',
            startIndex: 0,
        },
        {
            documents: [2132419687, 2132419686],
            nestedSpans: [
                {
                    documents: [2132419686],
                    text: 'OkayOkay',
                    startIndex: 0,
                },
            ],
            text: 'OkayOkay',
            startIndex: 0,
        },
    ],
    index: '',
} satisfies SchemaAttributionResponse;

export const v5AttributionHandlers = [
    v5TypedHttp.post('/v5/attribution/', async ({ request, response }) => {
        const requestBody = (await request.json()) as Record<string, unknown>;

        if (requestBody.model_response === 'OkayOkayOkayOkayOkayOkayOkayOkayOkay') {
            return response(200).json(fakeAttributionResponse);
        }

        if (
            typeof requestBody.model_response === 'string' &&
            requestBody.model_response.startsWith('HighlightStressTest')
        ) {
            return response(200).json(highlightStressTestResponse);
        }

        if (
            typeof requestBody.model_response === 'string' &&
            requestBody.model_response.startsWith('Penguins are fascinating birds')
        ) {
            return response(200).json(duplicateDocumentsResponse);
        }

        if (
            typeof requestBody.model_response === 'string' &&
            requestBody.model_response.startsWith(
                'Seattle, a vibrant city full of culture, nature, and innovation,'
            )
        ) {
            return response(200).json(documentWithMultipleSnippetsResponse);
        }

        if (
            typeof requestBody.model_response === 'string' &&
            requestBody.model_response.startsWith('To approach this problem,')
        ) {
            return response(200).json(overlappingSpansResponse);
        }
    }),
];
