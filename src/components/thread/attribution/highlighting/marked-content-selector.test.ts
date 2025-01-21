import { DeepPartial } from 'react-hook-form';

import { Role } from '@/api/Role';
import { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { markedContentSelector } from './marked-content-selector';

describe('documentFirstMarkedContentSelector', () => {
    it('should select a selected and previewed span', () => {
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
                    content: 'This is a message from the LLM',
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
                selection: {
                    type: 'document',
                    documentIndex: '12345',
                },
                attributionsByMessageId: {
                    llmMessage: {
                        orderedDocumentIndexes: ['12345', '67890'],
                        loadingState: RemoteState.Loaded,
                        documents: {
                            12345: {
                                corresponding_spans: [0],
                                corresponding_span_texts: ['This is a'],
                                index: '12345',
                                source: 'c4',
                                text: 'document 1',
                                relevance_score: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        corresponding_span_text: 'This is a',
                                    },
                                ],
                                title: 'Title',
                            },
                            67890: {
                                corresponding_spans: [1],
                                corresponding_span_texts: ['message from the LLM'],
                                index: '67890',
                                source: 'c4',
                                text: '1.1',
                                relevance_score: 120.1537157594669,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        corresponding_span_text: 'message from the LLM',
                                    },
                                ],
                                title: 'Title 2',
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
                        },
                    },
                },
            },
        };

        // @ts-expect-error - I don't want to make the whole state, just what's relevant
        const result = markedContentSelector('llmMessage')(testState);

        expect(result).toContain(':attribution-highlight[This is a]{variant="selected" span="0"}');
    });

    it('should show spans as selected if its previewed and selected', () => {
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
                    content: 'This is a message from the LLM',
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
                                corresponding_span_texts: ['This is a', 'message from the LLM'],
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
                        },
                    },
                },
            },
        };

        // @ts-expect-error - I don't want to make the whole state, just what's relevant
        const result = markedContentSelector('llmMessage')(testState);

        expect(result).toContain(
            ':attribution-highlight[message from the LLM]{variant="selected" span="1"}'
        );
        expect(result).toContain(':attribution-highlight[This is a]{variant="selected" span="0"}');
    });
});
