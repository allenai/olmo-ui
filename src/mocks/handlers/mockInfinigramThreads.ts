import { JSONMessage } from '@/api/Message';
import { Role } from '@/api/Role';

// Created based on https://docs.google.com/document/d/1s8RLWVofHtLAI_SlHayYYG9DmbuLIrra_d4ltOcqXxw/edit?usp=sharing
export const infiThreadCase01 = 'msg_INFICASE01';
export const mockInfiThreadCase01Response: JSONMessage = {
    id: infiThreadCase01,
    content: 'Infinigram Case 1',
    snippet: 'Infinigram Case 1',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        temperature: 1,
        n: 1,
        top_p: 1,
    },
    root: infiThreadCase01,
    created: new Date().toISOString(),
    children: [
        {
            id: 'msg_INFIRESP01',
            content:
                'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            snippet:
                'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: infiThreadCase01,
            created: new Date().toISOString(),
            parent: infiThreadCase01,
            logprobs: [],
            completion: 'cpl_INFIRESP01',
            final: true,
            private: false,
            model_type: 'chat',
            labels: [],
        },
    ],
    final: true,
    private: false,
    labels: [],
};

export const infiThreadCase02 = 'msg_INFICASE02';
export const mockInfiThreadCase02Response: JSONMessage = {
    id: infiThreadCase02,
    content: 'Infinigram Case 2',
    snippet: 'Infinigram Case 2',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        temperature: 1,
        n: 1,
        top_p: 1,
    },
    root: infiThreadCase02,
    created: new Date().toISOString(),
    children: [
        {
            id: 'msg_INFIRESP02',
            content:
                'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence. They are found in the seas and oceans.',
            snippet:
                'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence. They are found in the seas and oceans.',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: infiThreadCase02,
            created: new Date().toISOString(),
            parent: infiThreadCase02,
            logprobs: [],
            completion: 'cpl_INFIRESP02',
            final: true,
            private: false,
            model_type: 'chat',
            labels: [],
        },
    ],
    final: true,
    private: false,
    labels: [],
};

export const infiThreadCase03 = 'msg_INFICASE03';
export const mockInfiThreadCase03Response: JSONMessage = {
    id: infiThreadCase03,
    content: 'Infinigram Case 3',
    snippet: 'Infinigram Case 3',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        temperature: 1,
        n: 1,
        top_p: 1,
    },
    root: infiThreadCase03,
    created: new Date().toISOString(),
    children: [
        {
            id: 'msg_INFIRESP03',
            content:
                'Dolphins are marine mammals that are well-known for their social behavior, acrobatic abilities, and intelligence.',
            snippet:
                'Dolphins are marine mammals that are well-known for their social behavior, acrobatic abilities, and intelligence.',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: infiThreadCase03,
            created: new Date().toISOString(),
            parent: infiThreadCase03,
            logprobs: [],
            completion: 'cpl_INFIRESP03',
            final: true,
            private: false,
            model_type: 'chat',
            labels: [],
        },
    ],
    final: true,
    private: false,
    labels: [],
};

export const infiThreadCase04 = 'msg_INFICASE04';
export const mockInfiThreadCase04Response: JSONMessage = {
    id: infiThreadCase04,
    content: 'Infinigram Case 4',
    snippet: 'Infinigram Case 4',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        temperature: 1,
        n: 1,
        top_p: 1,
    },
    root: infiThreadCase04,
    created: new Date().toISOString(),
    children: [
        {
            id: 'msg_INFIRESP04',
            content:
                'Dolphins are marine mammals that are well-known for their social behavior, acrobatic abilities, and intelligence.',
            snippet:
                'Dolphins are marine mammals that are well-known for their social behavior, acrobatic abilities, and intelligence.',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: infiThreadCase04,
            created: new Date().toISOString(),
            parent: infiThreadCase04,
            logprobs: [],
            completion: 'cpl_INFIRESP04',
            final: true,
            private: false,
            model_type: 'chat',
            labels: [],
        },
    ],
    final: true,
    private: false,
    labels: [],
};

export const infiThreadCase05 = 'msg_INFICASE05';
export const mockInfiThreadCase05Response: JSONMessage = {
    id: infiThreadCase05,
    content: 'Infinigram Case 5',
    snippet: 'Infinigram Case 5',
    creator: 'murphy@allenai.org',
    role: Role.User,
    opts: {
        max_tokens: 2048,
        temperature: 1,
        n: 1,
        top_p: 1,
    },
    root: infiThreadCase05,
    created: new Date().toISOString(),
    children: [
        {
            id: 'msg_INFIRESP05',
            content:
                'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            snippet:
                'Dolphins are marine mammals that belong to the dolphin family, which consists of about 40 species. Dolphins are classified under the order Cetacea, along with whales and porpoises. These intelligent creatures are well-known for their social behavior, acrobatic abilities, and intelligence.',
            creator: 'murphy@allenai.org',
            role: Role.LLM,
            opts: {
                max_tokens: 2048,
                temperature: 1,
                n: 1,
                top_p: 1,
            },
            root: infiThreadCase05,
            created: new Date().toISOString(),
            parent: infiThreadCase05,
            logprobs: [],
            completion: 'cpl_INFIRESP05',
            final: true,
            private: false,
            model_type: 'chat',
            labels: [],
        },
    ],
    final: true,
    private: false,
    labels: [],
};

const infinigramCaseIds = [
    infiThreadCase01,
    infiThreadCase02,
    infiThreadCase03,
    infiThreadCase04,
    infiThreadCase05,
];
const infinigramResponses = [
    mockInfiThreadCase01Response,
    mockInfiThreadCase02Response,
    mockInfiThreadCase03Response,
    mockInfiThreadCase04Response,
    mockInfiThreadCase05Response,
];

// Infinigram only relies on model_response to find the corresponding attribution responsse
// This may let Infinigram find an incorrect attribution response when two different threads has the same response
// This step adds response Id to the end of the content to avoid it
const mockInfinigramResponses = infinigramResponses.map((resp) => {
    const child = resp.children?.[0];
    const identifiableResp = { ...resp };

    if (child) {
        const newChild = { ...child };
        newChild.content = child.content + ' ' + child.id;
        identifiableResp.children = [newChild];
    }

    return identifiableResp;
});

export { infinigramCaseIds, mockInfinigramResponses };
