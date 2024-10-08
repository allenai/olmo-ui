import { AttributionResponse } from '@/api/AttributionClient';

import { mockInfinigramResponses } from './mockInfinigramThreads';

const mockAttributionCase01Response: AttributionResponse = {
    documents: [
        {
            corresponding_span_texts: ['Dolphins are marine mammals that belong to the'],
            corresponding_spans: [0],
            index: '1000',
            source: 'c4',
            text: 'Dolphins are marine mammals that belong to the suborder toothed whales. They are found in the seas and oceans, as well as rivers with access to the sea. As a rule, they feed on cr',
            title: 'Doc 1000',
        },
        {
            corresponding_span_texts: ['are classified under the order Cetacea'],
            corresponding_spans: [1],
            index: '1005',
            source: 'c4',
            text: 'urus or apatosaurus once inhabited all the continents. Which is an example of a cetacean? Chimpanzee *Right whale Abalone Turkey vulture Amoeba ?Taxonomically speaking, whales are classified under the order Cetacea, hence the name. The Triton is a celebrated: Destroyer Airplane *Submarine Hydrogen bomb Aircraft carrier ?The U.S. Navy sub made the first around',
            title: 'Doc 1005',
        },
    ],
    spans: [
        {
            documents: [1000],
            nested_spans: [
                {
                    documents: [1000],
                    text: 'Dolphins are marine mammals that belong to the',
                },
            ],
            text: 'Dolphins are marine mammals that belong to the',
        },
        {
            documents: [1005],
            nested_spans: [
                {
                    documents: [1005],
                    text: 'are classified under the order Cetacea',
                },
            ],
            text: 'are classified under the order Cetacea',
        },
    ],
};

const mockAttributionCase02Response: AttributionResponse = {
    documents: [
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['Dolphins are marine mammals that belong to the'],
            index: '1000',
            source: 'c4',
            text: 'Dolphins are marine mammals that belong to the suborder toothed whales. They are found in the seas and oceans, as well as rivers with access to the sea. As a rule, they feed on cr',
            title: 'Doc 1000',
        },
        {
            corresponding_spans: [1],
            corresponding_span_texts: ['They are found in the seas and oceans'],
            index: '1000',
            source: 'c4',
            text: 'Dolphins are marine mammals that belong to the suborder toothed whales. They are found in the seas and oceans, as well as rivers with access to the sea. As a rule, they feed on cr',
            title: 'Doc 1000',
        },
    ],
    spans: [
        {
            documents: [1000],
            nested_spans: [
                {
                    documents: [1000],
                    text: 'Dolphins are marine mammals that belong to the',
                },
            ],
            text: 'Dolphins are marine mammals that belong to the',
        },
        {
            documents: [1000],
            nested_spans: [
                {
                    documents: [1000],
                    text: 'They are found in the seas and oceans',
                },
            ],
            text: 'They are found in the seas and oceans',
        },
    ],
};

const mockAttributionCase03Response: AttributionResponse = {
    documents: [
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['Dolphins are marine mammals that '],
            index: '1010',
            source: 'c4',
            text: 'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            title: 'Doc 1010',
        },
        {
            corresponding_spans: [1],
            corresponding_span_texts: ['are well-known for their social behavior'],
            index: '1010',
            source: 'c4',
            text: 'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            title: 'Doc 1010',
        },
    ],
    spans: [
        {
            documents: [1010],
            nested_spans: [
                {
                    documents: [1010],
                    text: 'Dolphins are marine mammals that ',
                },
            ],
            text: 'Dolphins are marine mammals that ',
        },
        {
            documents: [1010],
            nested_spans: [
                {
                    documents: [1010],
                    text: 'are well-known for their social behavior',
                },
            ],
            text: 'are well-known for their social behavior',
        },
    ],
};

const mockAttributionCase04Response: AttributionResponse = {
    documents: [
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['Dolphins are marine mammals that are '],
            index: '1010',
            source: 'c4',
            text: 'Dolphins are marine mammals that are under the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            title: 'Doc 1010',
        },
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['are well-known for their social behavior'],
            index: '1010',
            source: 'c4',
            text: 'Dolphins are marine mammals that are under the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            title: 'Doc 1010',
        },
    ],
    spans: [
        {
            documents: [1010],
            nested_spans: [
                {
                    documents: [1010],
                    text: 'Dolphins are marine mammals that are ',
                },
                {
                    documents: [1010],
                    text: 'are well-known for their social behavior',
                },
            ],
            text: 'Dolphins are marine mammals that are well-known for their social behavior',
        },
    ],
};

const mockAttributionCase05Response: AttributionResponse = {
    documents: [
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['Dolphins are marine mammals that belong to the'],
            index: '1000',
            source: 'c4',
            text: 'Dolphins are marine mammals that belong to the suborder toothed whales. They are found in the seas and oceans, as well as rivers with access to the sea. As a rule, they feed on cr',
            title: 'Doc 1000',
        },
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['Dolphins are marine mammals that belong to the'],
            index: '1001',
            source: 'c4',
            text: 'hair at some point during their life ...\nDolphin Facts and Information\n ... and more. Facts about the Bottlenose Dolphins, the Amazon Pink Dolphin, the Spinner. ... Dolphins are marine mammals that belong to the order Cetacea.\n',
            title: 'Doc 1001',
        },
        {
            corresponding_spans: [0],
            corresponding_span_texts: ['marine mammals that belong to the dolphin'],
            index: '1002',
            source: 'c4',
            text: 'individual enters in a different environment…\n Words: 944 - Pages: 4\n • Essay On Whales In Captivity\n Killer Whales are a very large and strong breed of marine mammals that belong to the dolphin family that can grow up to ten meters long and can weigh up to six tons. Theses whales are a highly social species that are very intelligent with an excellent sense of hearing and',
            title: 'Doc 1002',
        },
    ],
    spans: [
        {
            documents: [1000, 1001, 1002],
            nested_spans: [
                {
                    documents: [1000, 1001],
                    text: 'Dolphins are marine mammals that belong to the',
                },
                {
                    documents: [1002],
                    text: 'marine mammals that belong to the dolphin',
                },
            ],
            text: 'Dolphins are marine mammals that belong to the dolphin',
        },
    ],
};

const mockAttributionCaseResponses = [
    mockAttributionCase01Response,
    mockAttributionCase02Response,
    mockAttributionCase03Response,
    mockAttributionCase04Response,
    mockAttributionCase05Response,
];

const mockInfiThreadResponseToMockAttribution: {
    model_response: string;
    attribution_response: AttributionResponse;
}[] = [];

// create a mapping between model response and its corresponding attribution response
for (let index = 0; index < mockInfinigramResponses.length; index++) {
    mockInfiThreadResponseToMockAttribution.push({
        model_response: mockInfinigramResponses[index]?.children?.[0].content ?? '',
        attribution_response: mockAttributionCaseResponses[index],
    });
}

export { mockAttributionCaseResponses, mockInfiThreadResponseToMockAttribution };
