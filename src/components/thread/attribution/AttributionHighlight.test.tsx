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
                                correspondingSpans: [0, 1],
                                correspondingSpanTexts: ['This is a', 'message from the LLM'],
                                index: '12345',
                                source: 'c4',
                                textLong: 'document 1',
                                relevanceScore: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'This is a',
                                    },
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'message from the LLM',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [12345],
                                text: 'This is a',
                                nestedSpans: [],
                            },
                            1: {
                                documents: [67890],
                                text: 'message from the LLM',
                                nestedSpans: [],
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

        const highlight = screen.getByRole('button', {
            name: 'This is a',
        });
        expect(highlight).not.toHaveAttribute('data-selection-type');
    });

    it('should show a highlight when the span is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        const initialState: DeepPartial<AppContextState> = {
            currentOpenDrawer: 'attribution',
            attribution: {
                selectedMessageId: 'llmMessage',
                selection: { type: 'span', selectedSpanIds: ['0'] },
                attributionsByMessageId: {
                    llmMessage: {
                        orderedDocumentIndexes: ['12345'],
                        loadingState: RemoteState.Loaded,
                        documents: {
                            12345: {
                                correspondingSpans: [0, 1],
                                correspondingSpanTexts: ['This is a', 'message from the LLM'],
                                index: '12345',
                                source: 'c4',
                                textLong: 'document 1',
                                relevanceScore: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'This is a',
                                    },
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'message from the LLM',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [12345],
                                text: 'This is a',
                                nestedSpans: [],
                            },
                            1: {
                                documents: [67890],
                                text: 'message from the LLM',
                                nestedSpans: [],
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

        const highlight = screen.getByRole('button', {
            name: 'This is a',
        });
        expect(highlight).toHaveAttribute('data-selection-type', 'span');
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
                                correspondingSpans: [0, 1],
                                correspondingSpanTexts: ['This is a', 'message from the LLM'],
                                index: '12345',
                                source: 'c4',
                                textLong: 'document 1',
                                relevanceScore: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'This is a',
                                    },
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'message from the LLM',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [12345],
                                text: 'This is a',
                                nestedSpans: [],
                            },
                            1: {
                                documents: [67890],
                                text: 'message from the LLM',
                                nestedSpans: [],
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
            screen.queryByRole('button', { name: /Show documents related to this span*/ })
        ).not.toBeInTheDocument();
        expect(screen.queryByText('This is a')).toBeInTheDocument();
    });

    it('should show a highlight when a corresponding document is selected', () => {
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(document, 'querySelector').mockImplementation(() => {
            return null;
        });

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
                                correspondingSpans: [0, 1],
                                correspondingSpanTexts: ['This is a', 'message from the LLM'],
                                index: '12345',
                                source: 'c4',
                                textLong: 'document 1',
                                relevanceScore: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'This is a',
                                    },
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'message from the LLM',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [12345],
                                text: 'This is a',
                                nestedSpans: [],
                            },
                            1: {
                                documents: [67890],
                                text: 'message from the LLM',
                                nestedSpans: [],
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

        const highlight = screen.getByRole('button', {
            name: 'This is a',
        });
        expect(highlight).toHaveAttribute('data-selection-type', 'document');
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
                                correspondingSpans: [0, 1],
                                correspondingSpanTexts: ['This is a', 'message from the LLM'],
                                index: '12345',
                                source: 'c4',
                                textLong: 'document 1',
                                relevanceScore: 1.6,
                                snippets: [
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'This is a',
                                    },
                                    {
                                        text: 'This is a part of a larger document that contains the text "message from the LLM"',
                                        correspondingSpanText: 'message from the LLM',
                                    },
                                ],
                                title: 'Title',
                            },
                        },
                        spans: {
                            0: {
                                documents: [12345],
                                text: 'This is a',
                                nestedSpans: [],
                            },
                            1: {
                                documents: [67890],
                                text: 'message from the LLM',
                                nestedSpans: [],
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
            screen.queryByRole('button', { name: /Show documents related to this span*/ })
        ).not.toBeInTheDocument();
        expect(screen.queryByText('This is a')).toBeInTheDocument();
    });
});
