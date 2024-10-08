import { http, HttpResponse, passthrough } from 'msw';

import highlightStressTestResponse from './highlightStressTestResponse.json';
import { mockInfiThreadResponseToMockAttribution } from './mockAttributionResponses';

const fakeAttributionResponse = {
    documents: [
        {
            corresponding_spans: ['OkayOkayOkayOkayOkayOkayOkayOkay'],
            index: '2132419686',
            source: 'c4',
            text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
            title: null,
        },
        {
            corresponding_spans: ['OkayOkay'],
            index: '2132419687',
            source: 'c4',
            text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
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
            documents: [2132419687],
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

        for (let idx = 0; idx < mockInfiThreadResponseToMockAttribution.length; idx++) {
            if (
                requestBody.model_response ===
                mockInfiThreadResponseToMockAttribution[idx].model_response
            ) {
                return new HttpResponse(
                    JSON.stringify(
                        mockInfiThreadResponseToMockAttribution[idx].attribution_response
                    )
                );
            }
        }

        return passthrough();
    }),
];
