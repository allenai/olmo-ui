import { http, HttpResponse, passthrough } from 'msw';

const fakeAttributionResponse = {
    documents: {
        '2132419686': {
            corresponding_spans: ['OkayOkayOkayOkayOkayOkayOkayOkay'],
            index: '2132419686',
            source: 'c4',
            text: "exes.\nCooooool, would this supposedly fix some translation issues I'm having with Shady Job too, if it runs from a 1.13 build? I better get reading on this topic.\nOkayOkayOkayOkayOkayOkayOkayOkayOkay where's this new SCI??\nintegrated in 1.13-UB if yes.\nIt all depends on what they needed that proprietary ex",
            title: null,
        },
    },
    spans: {
        OkayOkayOkayOkayOkayOkayOkayOkay: {
            corresponding_documents: [2132419686],
            text: 'OkayOkayOkayOkayOkayOkayOkayOkay',
        },
    },
};

export const attributionHandlers = [
    http.post('*/v3/attribution', async ({ request }) => {
        const requestBody = (await request.json()) as Record<string, unknown>;

        if (requestBody.model_response === 'OkayOkayOkayOkayOkayOkayOkayOkayOkay') {
            return new HttpResponse(JSON.stringify(fakeAttributionResponse));
        }

        return passthrough();
    }),
];
