import { http, HttpResponse } from 'msw';

import { staticData } from '@/api/dolma/staticData';

export const dolmaHandlers = [
    http.get(`${process.env.DOLMA_API_URL}/static/sources.json`, () => {
        return HttpResponse.json(fakeSources);
    }),

    http.get(`${process.env.DOLMA_API_URL}/static/source_counts/data.json`, () => {
        return HttpResponse.json(fakeSourceCount);
    }),

    http.get(`${process.env.DOLMA_API_URL}/static/words/data.json`, () => {
        return HttpResponse.json(fakeWords);
    }),

    http.get(`${process.env.DOLMA_API_URL}/v1/meta`, () => {
        return HttpResponse.json(fakeCount);
    }),
];

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

const fakeWords: staticData.BinnedBySource = {
    gutenberg: [
        { min: 20, max: 60, doc_count: 2, percentage: 3.670465598561178e-5 },
        { min: 60, max: 100, doc_count: 1, percentage: 1.835232799280589e-5 },
        { min: 100, max: 140, doc_count: 4, percentage: 7.340931197122355e-5 },
        { min: 140, max: 180, doc_count: 1, percentage: 1.835232799280589e-5 },
        { min: 180, max: 240, doc_count: 18, percentage: 0.00033034190387050595 },
        { min: 240, max: 300, doc_count: 19, percentage: 0.00034869423186331184 },
        { min: 300, max: 380, doc_count: 37, percentage: 0.0006790361357338178 },
        { min: 380, max: 460, doc_count: 43, percentage: 0.0007891501036906531 },
        { min: 460, max: 560, doc_count: 53, percentage: 0.0009726733836187121 },
        { min: 560, max: 680, doc_count: 61, percentage: 0.001119492007561159 },
        { min: 680, max: 820, doc_count: 64, percentage: 0.0011745489915395769 },
        { min: 820, max: 980, doc_count: 90, percentage: 0.0016517095193525299 },
        { min: 980, max: 1180, doc_count: 119, percentage: 0.0021839270311439004 },
        { min: 1180, max: 1420, doc_count: 138, percentage: 0.0025326212630072125 },
        { min: 1420, max: 1700, doc_count: 157, percentage: 0.0028813154948705245 },
        { min: 1700, max: 2020, doc_count: 209, percentage: 0.0038356365504964305 },
        { min: 2020, max: 2420, doc_count: 255, percentage: 0.004679843638165502 },
        { min: 2420, max: 2880, doc_count: 363, percentage: 0.006661895061388537 },
        { min: 2880, max: 3420, doc_count: 430, percentage: 0.007891501036906532 },
        { min: 3420, max: 4060, doc_count: 560, percentage: 0.010277303675971298 },
        { min: 4060, max: 4840, doc_count: 722, percentage: 0.01325038081080585 },
        { min: 4840, max: 5760, doc_count: 824, percentage: 0.01512231826607205 },
        { min: 5760, max: 6840, doc_count: 927, percentage: 0.01701260804933106 },
        { min: 6840, max: 8120, doc_count: 1063, percentage: 0.01950852465635266 },
        { min: 8120, max: 9660, doc_count: 1273, percentage: 0.023362513534841894 },
        { min: 9660, max: 11480, doc_count: 1374, percentage: 0.02521609866211529 },
        { min: 11480, max: 13640, doc_count: 1629, percentage: 0.02989594230028079 },
        { min: 13640, max: 16200, doc_count: 1609, percentage: 0.029528895740424672 },
        { min: 16200, max: 19260, doc_count: 2001, percentage: 0.03672300831360458 },
        { min: 19260, max: 22900, doc_count: 2095, percentage: 0.03844812714492833 },
        { min: 22900, max: 27220, doc_count: 2116, percentage: 0.03883352603277726 },
        { min: 27220, max: 32340, doc_count: 2152, percentage: 0.03949420984051827 },
        { min: 32340, max: 38440, doc_count: 2469, percentage: 0.04531189781423774 },
        { min: 38440, max: 45700, doc_count: 3174, percentage: 0.05825028904916588 },
        { min: 45700, max: 54320, doc_count: 3852, percentage: 0.07069316742828828 },
        { min: 54320, max: 64560, doc_count: 4163, percentage: 0.07640074143405091 },
        { min: 64560, max: 76740, doc_count: 4102, percentage: 0.07528124942648975 },
        { min: 76740, max: 91240, doc_count: 4255, percentage: 0.07808915560938905 },
        { min: 91240, max: 108480, doc_count: 3478, percentage: 0.06382939675897888 },
        { min: 108480, max: 128960, doc_count: 2489, percentage: 0.04567894437409385 },
        { min: 128960, max: 153320, doc_count: 1853, percentage: 0.03400686377066931 },
        { min: 153320, max: 182300, doc_count: 1490, percentage: 0.027344968709280774 },
        { min: 182300, max: 216760, doc_count: 950, percentage: 0.01743471159316559 },
        { min: 216760, max: 257720, doc_count: 1174, percentage: 0.02154563306355411 },
    ],
    c4: [
        { min: 20, max: 60, doc_count: 19353935, percentage: 0.05314733599882279 },
        { min: 60, max: 100, doc_count: 28131004, percentage: 0.07724981620390003 },
        { min: 100, max: 140, doc_count: 21033021, percentage: 0.057758230259494815 },
        { min: 140, max: 180, doc_count: 16059222, percentage: 0.04409981058186291 },
        { min: 180, max: 240, doc_count: 24059146, percentage: 0.06606819317656763 },
        { min: 240, max: 300, doc_count: 18246626, percentage: 0.05010658364135541 },
        { min: 300, max: 380, doc_count: 20951024, percentage: 0.05753306043692925 },
        { min: 380, max: 460, doc_count: 16482198, percentage: 0.04526133394088205 },
        { min: 460, max: 560, doc_count: 16067863, percentage: 0.04412353940653685 },
        { min: 560, max: 680, doc_count: 13307528, percentage: 0.03654345547454522 },
        { min: 680, max: 820, doc_count: 10678549, percentage: 0.02932408482734354 },
        { min: 820, max: 980, doc_count: 8109766, percentage: 0.022270016845351043 },
        { min: 980, max: 1180, doc_count: 6498886, percentage: 0.017846421301923637 },
        { min: 1180, max: 1420, doc_count: 4642071, percentage: 0.012747470070938613 },
        { min: 1420, max: 1700, doc_count: 3351710, percentage: 0.00920404339172444 },
        { min: 1700, max: 2020, doc_count: 2519075, percentage: 0.0069175661399728024 },
        { min: 2020, max: 2420, doc_count: 1861487, percentage: 0.005111780888302076 },
        { min: 2420, max: 2880, doc_count: 1272187, percentage: 0.0034935195319367547 },
        { min: 2880, max: 3420, doc_count: 899320, percentage: 0.0024695991905760413 },
        { min: 3420, max: 4060, doc_count: 649441, percentage: 0.0017834129875093346 },
        { min: 4060, max: 4840, doc_count: 495390, percentage: 0.0013603775552856214 },
        { min: 4840, max: 5760, doc_count: 349229, percentage: 0.0009590086462279058 },
        { min: 5760, max: 6840, doc_count: 244566, percentage: 0.0006715963123720368 },
        { min: 6840, max: 8120, doc_count: 164334, percentage: 0.0004512733102612231 },
        { min: 8120, max: 9660, doc_count: 109084, percentage: 0.00029955272662099907 },
        { min: 9660, max: 11480, doc_count: 68642, percentage: 0.0001884960054702671 },
        { min: 11480, max: 13640, doc_count: 45581, percentage: 0.0001251687949847068 },
        { min: 13640, max: 16200, doc_count: 26323, percentage: 7.22849035866356e-5 },
        { min: 16200, max: 19260, doc_count: 14719, percentage: 4.04194619113205e-5 },
        { min: 19260, max: 22900, doc_count: 7588, percentage: 2.0837208844561447e-5 },
        { min: 22900, max: 27220, doc_count: 3272, percentage: 8.98515384019571e-6 },
        { min: 27220, max: 32340, doc_count: 827, percentage: 2.27100312525729e-6 },
        { min: 32340, max: 38440, doc_count: 27, percentage: 7.414399562508685e-8 },
        { min: 38440, max: 45700, doc_count: 4, percentage: 1.0984295648161015e-8 },
        { min: 45700, max: 54320, doc_count: 0, percentage: 0.0 },
        { min: 54320, max: 64560, doc_count: 0, percentage: 0.0 },
        { min: 64560, max: 76740, doc_count: 0, percentage: 0.0 },
        { min: 76740, max: 91240, doc_count: 0, percentage: 0.0 },
        { min: 91240, max: 108480, doc_count: 0, percentage: 0.0 },
        { min: 108480, max: 128960, doc_count: 0, percentage: 0.0 },
        { min: 128960, max: 153320, doc_count: 0, percentage: 0.0 },
        { min: 153320, max: 182300, doc_count: 0, percentage: 0.0 },
        { min: 182300, max: 216760, doc_count: 0, percentage: 0.0 },
        { min: 216760, max: 257720, doc_count: 0, percentage: 0.0 },
    ],
};
