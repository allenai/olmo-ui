import { DeepPartial } from 'react-hook-form';

import { Role } from '@/api/Role';
import { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { getAttributionHighlightString } from '../../attribution-highlight-utils';
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

    const makeTestAttributionHighlight = (content: string) =>
        getAttributionHighlightString('0', content);

    it.each<{ span: string; response?: string; expected: string }>([
        {
            span: '# H1 with # inside the span',
            expected: `# ${makeTestAttributionHighlight('H1 with # inside the span')}`,
        },
        {
            span: ' H1 with a space after #',
            response: '# H1 with a space after #',
            expected: `# ${makeTestAttributionHighlight('H1 with a space after #')}`,
        },
        {
            span: '##### H5 with # inside the span',
            expected: `##### ${makeTestAttributionHighlight('H5 with # inside the span')}`,
        },
        {
            span: ' H5 with a space after #####',
            response: '##### H5 with a space after #####',
            expected: `##### ${makeTestAttributionHighlight('H5 with a space after #####')}`,
        },
        {
            span: '[link with link stuff inside the span](#link)',
            expected: makeTestAttributionHighlight('[link with link stuff inside the span](#link)'),
        },
        {
            span: '* list item with * in the span',
            expected: `* ${makeTestAttributionHighlight('list item with * in the span')}`,
        },
        {
            span: ' list item with a space after *',
            response: '* list item with a space after *',
            expected: `* ${makeTestAttributionHighlight('list item with a space after *')}`,
        },
        {
            span: '- list item with - in the span',
            expected: `- ${makeTestAttributionHighlight('list item with - in the span')}`,
        },
        {
            span: ' list item with a space after -',
            response: '- list item with a space after -',
            expected: `- ${makeTestAttributionHighlight('list item with a space after -')}`,
        },
        {
            span: '+ list item with + in the span',
            expected: `+ ${makeTestAttributionHighlight('list item with + in the span')}`,
        },
        {
            span: ' list item with a space after +',
            response: '+ list item with a space after +',
            expected: `+ ${makeTestAttributionHighlight('list item with a space after +')}`,
        },
        {
            span: '> quote with > in the span',
            expected: `> ${makeTestAttributionHighlight('quote with > in the span')}`,
        },
        {
            span: ' quote with a space after >',
            response: '> quote with a space after >',
            expected: `> ${makeTestAttributionHighlight('quote with a space after >')}`,
        },
        {
            span: '1. numbered list with 1. in the span',
            expected: `1. ${makeTestAttributionHighlight('numbered list with 1. in the span')}`,
        },
        {
            span: ' list item with a space after 1.',
            response: '1. list item with a space after 1.',
            expected: `1. ${makeTestAttributionHighlight('list item with a space after 1.')}`,
        },
        {
            span: ' **span with a space at the start**',
            expected: ` ${makeTestAttributionHighlight('**span with a space at the start**')}`,
        },
        {
            span: '**span that contains bolding** and stuff afterward',
            expected: makeTestAttributionHighlight(
                '**span that contains bolding** and stuff afterward'
            ),
        },
        {
            span: 'code block with a span in it',
            response: '```js\ncode block with a span in it\n```',
            expected: `\`\`\`js\n${makeTestAttributionHighlight('code block with a span in it')}\n\`\`\``,
        },
        {
            span: '    code block with four spaces in the span',
            expected: `    ${makeTestAttributionHighlight('code block with four spaces in the span')}`,
        },
        {
            span: '`code span with tick in the span`',
            expected: `\`${makeTestAttributionHighlight('code span with tick in the span')}\``,
        },
        {
            span: ' code span with a space after tick in the span`',
            response: '` code span with a space after tick in the span',
            expected: `\` ${makeTestAttributionHighlight('code span with a space after tick in the span')}`,
        },
        {
            span: '`code span entirely contained inside a highlight`',
            expected: `\`${makeTestAttributionHighlight(
                'code span entirely contained inside a highlight'
            )}\``,
        },
        {
            span: '*emphasis with * in the span*',
            expected: makeTestAttributionHighlight('*emphasis with * in the span*'),
        },
        {
            span: '**emphasis with ** in the span**',
            expected: makeTestAttributionHighlight('**emphasis with ** in the span**'),
        },
        {
            span: '_italics with _ in the span_',
            expected: makeTestAttributionHighlight('_italics with _ in the span_'),
        },
        {
            span: '_italics _ with the italics starting in the span',
            response: '_italics _ with the italics starting in the span_',
            expected: `${makeTestAttributionHighlight('_italics _ with the italics starting in the span')}_`,
        },
        {
            span: 'italics _ with the italics ending in the span_',
            expected: 'fail',
        },
        {
            span: '__italics with __ in the span__',
            expected: makeTestAttributionHighlight('__italics with __ in the span__'),
        },
        {
            span: '__italics __ with the italics starting in the span',
            response: '__italics __ with the italics starting in the span__',
            expected: `${makeTestAttributionHighlight('__italics __ with the italics starting in the span')}__`,
        },
        {
            span: 'italics __ with the italics ending in the span__',
            response: '__italics __ with the italics ending in the span__',
            expected: `__${makeTestAttributionHighlight('italics __ with the italics ending in the span__')}`,
        },
        {
            span: 'span with opening brace in it [',
            expected: makeTestAttributionHighlight('span with opening brace in it ['),
        },
        {
            span: 'span with closing brace in it ]',
            expected: makeTestAttributionHighlight('span with closing brace in it ]'),
        },
        {
            span: 'span with both [ braces ] in it',
            expected: makeTestAttributionHighlight('span with both [ braces ] in it'),
        },
        {
            span: 'span with reversed ] braces [ in it',
            expected: makeTestAttributionHighlight('span with reversed ] braces [ in it'),
        },
        {
            span: "*span that starts with a * but shouldn't get changed",
            expected: makeTestAttributionHighlight(
                "*span that starts with a * but shouldn't get changed"
            ),
        },
    ])('should escape $span correctly', ({ span, response = span, expected }) => {
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
                    content: response,
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
                            '0': {
                                text: response,
                                text_long: response,
                                snippets: [
                                    {
                                        text: span,
                                        corresponding_span_text: span,
                                    },
                                ],
                                corresponding_spans: [0],
                                corresponding_span_texts: [span],
                                index: '0',
                                source: 'source',
                                relevance_score: 0,
                            },
                        },
                        spans: {
                            '0': {
                                text: span,
                                documents: [0],
                                start_index: 0,
                                nested_spans: [
                                    {
                                        text: span,
                                        documents: [0],
                                        start_index: 0,
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        };

        // @ts-expect-error - I don't want to make the whole state, just what's relevant
        const result = markedContentSelector('llmMessage')(testState);

        expect(result).toEqual(expected);
    });
});
