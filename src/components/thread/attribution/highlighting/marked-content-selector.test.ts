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

        expect(result).toContain(':attribution-highlight[message from the LLM]{span="1"}');
        expect(result).toContain(':attribution-highlight[This is a]{span="0"}');
    });
});
