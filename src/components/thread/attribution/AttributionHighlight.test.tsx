import { render, screen } from '@test-utils';
import { DeepPartial } from 'react-hook-form';

import * as AppContext from '@/AppContext';
import { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { AttributionHighlight } from './AttributionHighlight';

describe('AttributionHighlight', () => {
    it('should show a highlight when nothing is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState: DeepPartial<AppContextState> = {
            currentOpenDrawer: 'attribution',
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: null,
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

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionHighlight span={'0'}>This is a</AttributionHighlight>
            </FakeAppContextProvider>
        );

        expect(
            screen.getByRole('button', { name: 'Show documents related to this span' })
        ).toHaveTextContent('This is a');
    });

    it('should not show a highlight when another span is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState: DeepPartial<AppContextState> = {
            currentOpenDrawer: 'attribution',
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: { type: 'span', selectedSpanIds: ['1'] },
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

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionHighlight span={'0'}>This is a</AttributionHighlight>
            </FakeAppContextProvider>
        );

        expect(
            screen.queryByRole('button', { name: 'Show documents related to this span' })
        ).not.toBeInTheDocument();
        expect(screen.queryByText('This is a')).toBeInTheDocument();
    });

    it('should show a highlight when a corresponding document is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState: DeepPartial<AppContextState> = {
            currentOpenDrawer: 'attribution',
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

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionHighlight span={'0'}>This is a</AttributionHighlight>
            </FakeAppContextProvider>
        );

        expect(
            screen.getByRole('button', { name: 'Show documents related to this span' })
        ).toHaveTextContent('This is a');
    });

    it('should not show a highlight when a non-corresponding document is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState: DeepPartial<AppContextState> = {
            currentOpenDrawer: 'attribution',
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: { type: 'document', documentIndex: '67890' },
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

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionHighlight span={'0'}>This is a</AttributionHighlight>
            </FakeAppContextProvider>
        );

        expect(
            screen.queryByRole('button', { name: 'Show documents related to this span' })
        ).not.toBeInTheDocument();
        expect(screen.queryByText('This is a')).toBeInTheDocument();
    });
});
