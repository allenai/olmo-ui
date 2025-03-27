import { DeepPartial } from 'react-hook-form';

import { Role } from '@/api/Role';
import { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { markedContentSelector } from './marked-content-selector';

describe('markedContentSelector', () => {
    it('should give the right output for spans', () => {
        const testState: DeepPartial<AppContextState> = {
            selectedThreadRootId: 'userMessage',
            selectedThreadMessages: ['userMessage', 'llmMessage'],
            selectedThreadMessagesById: {
                userMessage: {
                    id: 'userMessage',
                    childIds: ['llmMessage'],
                    selectedChildId: 'llmMessage',
                    content: 'user prompt',
                    role: Role.User,
                    labels: [],
                    creator: 'currentUser',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    model_id: 'model',
                    opts: {},
                },
                llmMessage: {
                    id: 'llmMessage',
                    childIds: [],
                    content:
                        "This is a message from the LLM. **Best Time to Visit Paris for Climate:** - **Spring (March to May):** Milder weather with fewer tourists, making it ideal for exploring without the crowds. The city's gardens come to life, and the famous French blooming season is in full swing.",
                    role: Role.LLM,
                    labels: [],
                    creator: 'currentUser',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    parent: 'userMessage',
                    model_id: 'model',
                    opts: {},
                },
            },
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: { type: 'document', documentIndex: '12345' },
                attributionsByMessageId: {
                    llmMessage: {
                        orderedDocumentIndexes: ['12345'],
                        loadingState: RemoteState.Loaded,
                        documents: {
                            12345: {
                                corresponding_spans: [0, 1],
                                corresponding_span_texts: [
                                    'This is a',
                                    'message from the LLM',
                                    '- **Spring (March to May):** Milder weather with fewer tourists',
                                ],
                                index: '12345',
                                source: 'c4',
                                text: 'document 1',
                                relevance_score: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        corresponding_span_text: 'This is a',
                                    },
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        corresponding_span_text: 'message from the LLM',
                                    },
                                    {
                                        text: '**Best Time to Visit Paris for Climate:** - **Spring (March to May):** Milder weather with fewer tourists, making it ideal for exploring without the crowds.',
                                        corresponding_span_text:
                                            '- **Spring (March to May):** Milder weather with fewer tourists',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [12345],
                                text: 'This is a',
                                nested_spans: [],
                            },
                            1: {
                                documents: [67890],
                                text: 'message from the LLM',
                                nested_spans: [],
                            },
                            2: {
                                documents: [12345],
                                text: '- **Spring (March to May):** Milder weather with fewer tourists',
                                nested_spans: [],
                            },
                        },
                    },
                },
            },
        };

        // @ts-expect-error - I don't want to make the whole state, just what's relevant
        const result = markedContentSelector('llmMessage')(testState);

        expect(result).toContain(
            '<attribution-highlight span="1">message from the LLM</attribution-highlight>'
        );
        expect(result).toContain(
            '<attribution-highlight span="0">This is a</attribution-highlight>'
        );
        expect(result).toContain(
            '<attribution-highlight span="2">**Spring (March to May):** Milder weather with fewer tourists</attribution-highlight>'
        );
    });

    it('should not nest spans inside others', () => {
        const testState: DeepPartial<AppContextState> = {
            selectedThreadRootId: 'userMessage',
            selectedThreadMessages: ['userMessage', 'llmMessage'],
            selectedThreadMessagesById: {
                userMessage: {
                    id: 'userMessage',
                    childIds: ['llmMessage'],
                    selectedChildId: 'llmMessage',
                    content: 'user prompt',
                    role: Role.User,
                    labels: [],
                    creator: 'currentUser',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    model_id: 'model',
                    opts: {},
                },
                llmMessage: {
                    id: 'llmMessage',
                    childIds: [],
                    content: 'longer span with text inside - shorter span - span with text',
                    role: Role.LLM,
                    labels: [],
                    creator: 'currentUser',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    parent: 'userMessage',
                    model_id: 'model',
                    opts: {},
                },
            },
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: { type: 'document', documentIndex: '1' },
                attributionsByMessageId: {
                    llmMessage: {
                        orderedDocumentIndexes: ['1'],
                        loadingState: RemoteState.Loaded,
                        documents: {
                            1: {
                                corresponding_spans: [0, 1, 2],
                                corresponding_span_texts: [
                                    'longer span with text inside',
                                    'shorter span',
                                    'span with text',
                                ],
                                index: '12345',
                                source: 'c4',
                                text: 'document 1',
                                relevance_score: 1.6,
                                snippets: [
                                    {
                                        text: 'longer span with text inside',
                                        corresponding_span_text: 'longer span with text inside',
                                    },
                                    {
                                        text: 'shorter span',
                                        corresponding_span_text: 'shorter span',
                                    },
                                    {
                                        text: 'span with text',
                                        corresponding_span_text: 'span with text',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [1],
                                text: 'longer span with text inside',
                                nested_spans: [],
                            },
                            1: {
                                documents: [1],
                                text: 'shorter span',
                                nested_spans: [],
                            },
                            2: {
                                documents: [1],
                                text: 'span with text',
                                nested_spans: [],
                            },
                        },
                    },
                },
            },
        };

        // @ts-expect-error - I don't want to make the whole state, just what's relevant
        const result = markedContentSelector('llmMessage')(testState);

        expect(result).toContain(
            '<attribution-highlight span="0">longer span with text inside</attribution-highlight>'
        );
        expect(result).toContain(
            '<attribution-highlight span="1">shorter span</attribution-highlight>'
        );
        expect(result).toContain(
            '<attribution-highlight span="2">span with text</attribution-highlight>'
        );
    });

    it('should continue matching if one span has no matches within the text', () => {
        const testState: DeepPartial<AppContextState> = {
            selectedThreadRootId: 'userMessage',
            selectedThreadMessages: ['userMessage', 'llmMessage'],
            selectedThreadMessagesById: {
                userMessage: {
                    id: 'userMessage',
                    childIds: ['llmMessage'],
                    selectedChildId: 'llmMessage',
                    content: 'user prompt',
                    role: Role.User,
                    labels: [],
                    creator: 'currentUser',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    model_id: 'model',
                    opts: {},
                },
                llmMessage: {
                    id: 'llmMessage',
                    childIds: [],
                    content: 'longer span with text inside - span with text',
                    role: Role.LLM,
                    labels: [],
                    creator: 'currentUser',
                    isLimitReached: false,
                    isOlderThan30Days: false,
                    parent: 'userMessage',
                    model_id: 'model',
                    opts: {},
                },
            },
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: { type: 'document', documentIndex: '1' },
                attributionsByMessageId: {
                    llmMessage: {
                        orderedDocumentIndexes: ['1'],
                        loadingState: RemoteState.Loaded,
                        documents: {
                            1: {
                                corresponding_spans: [0, 1, 2],
                                corresponding_span_texts: [
                                    'longer span with text inside',
                                    'shorter span',
                                    'span with text',
                                ],
                                index: '12345',
                                source: 'c4',
                                text: 'document 1',
                                relevance_score: 1.6,
                                snippets: [
                                    {
                                        text: 'longer span with text inside',
                                        corresponding_span_text: 'longer span with text inside',
                                    },
                                    {
                                        text: 'shorter span',
                                        corresponding_span_text: 'shorter span',
                                    },
                                    {
                                        text: 'span with text',
                                        corresponding_span_text: 'span with text',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [1],
                                text: 'longer span with text inside',
                                nested_spans: [],
                            },
                            1: {
                                documents: [1],
                                text: 'shorter span',
                                nested_spans: [],
                            },
                            2: {
                                documents: [1],
                                text: 'span with text',
                                nested_spans: [],
                            },
                        },
                    },
                },
            },
        };

        // @ts-expect-error - I don't want to make the whole state, just what's relevant
        const result = markedContentSelector('llmMessage')(testState);

        expect(result).toContain(
            '<attribution-highlight span="0">longer span with text inside</attribution-highlight>'
        );
        expect(result).not.toContain(
            '<attribution-highlight span="1">shorter span</attribution-highlight>'
        );
        expect(result).toContain(
            '<attribution-highlight span="2">span with text</attribution-highlight>'
        );
    });
});
