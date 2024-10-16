import { http, HttpResponse, passthrough } from 'msw';

import highlightStressTestResponse from './highlightStressTestResponse.json';

const fakeAttributionResponse = {
    documents: [
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['OkayOkayOkayOkayOkayOkayOkayOkay', 'OkayOkay'],
            index: '2132419686',
            source: 'c4',
            text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
            snippets: [
                {
                    text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
                    corresponding_span_text: 'OkayOkayOkayOkayOkayOkayOkayOkay',
                },
                {
                    text: 'some text surrounding OkayOkay end surrounding',
                    corresponding_span_text: 'OkayOkay',
                },
            ],
            title: null,
        },
        {
            corresponding_spans: [1],
            corresponding_span_texts: ['OkayOkay'],
            index: '2132419687',
            source: 'c4',
            text: 'some text surrounding OkayOkay end surrounding',
            snippets: [
                {
                    text: 'some text surrounding OkayOkay end surrounding',
                    corresponding_span_text: 'OkayOkay',
                },
            ],
            title: null,
        },
    ],
    spans: [
        {
            documents: [2132419686],
            nested_spans: [
                {
                    documents: [2132419686],
                    text: 'OkayOkayOkayOkayOkayOkayOkayOkay',
                },
            ],
            text: 'OkayOkayOkayOkayOkayOkayOkayOkay',
        },
        {
            documents: [2132419687, 2132419686],
            nested_spans: [
                {
                    documents: [2132419686],
                    text: 'OkayOkay',
                },
            ],
            text: 'OkayOkay',
        },
    ],
};

export const attributionHandlers = [
    http.post('*/v3/attribution', async ({ request }) => {
        const requestBody = (await request.json()) as Record<string, unknown>;

        if (requestBody.model_response === 'OkayOkayOkayOkayOkayOkayOkayOkayOkay') {
            return new HttpResponse(JSON.stringify(fakeAttributionResponse));
        }

        if (
            typeof requestBody.model_response === 'string' &&
            requestBody.model_response.startsWith('HighlightStressTest')
        ) {
            return new HttpResponse(JSON.stringify(highlightStressTestResponse));
        }

        return passthrough();
    }),
];
