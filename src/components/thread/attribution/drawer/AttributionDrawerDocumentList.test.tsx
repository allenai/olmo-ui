import { render, screen } from '@test-utils';
import type { ComponentProps } from 'react';

import { Document } from '@/api/AttributionClient';
import * as appContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';

describe('AttributionDrawerDocumentList', () => {
    beforeEach(() => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should display documents in the order provided in the store', () => {
        const documentOrder = ['1', '2', '3', '4', '5'];

        const initialState = {
            selectedThreadMessagesById: {
                message: {
                    id: 'message',
                    content: 'message 01',
                },
            },
            attribution: {
                selectedMessageId: 'message',
                attributionsByMessageId: {
                    message: {
                        orderedDocumentIndexes: documentOrder,
                        documents: {
                            1: {
                                index: '1',
                                text: 'document 1',
                                text_long: 'document 1 span 1',
                                corresponding_span_texts: ['span 1'],
                                corresponding_spans: [0],
                                source: 'made up',
                                relevance_score: 1.5,
                                url: undefined,
                                snippets: [
                                    { text: 'document 1', corresponding_span_text: 'span 1' },
                                ],
                            },
                            2: {
                                index: '2',
                                text: 'document 2',
                                text_long: 'document 2 span 2',
                                corresponding_span_texts: ['span 2'],
                                corresponding_spans: [1],
                                source: 'made up',
                                relevance_score: 1.2,
                                url: undefined,
                                snippets: [
                                    { text: 'document 2', corresponding_span_text: 'span 2' },
                                ],
                            },
                            3: {
                                index: '3',
                                text: 'document 3',
                                text_long: 'document 3 span 3',
                                corresponding_span_texts: ['span 3'],
                                corresponding_spans: [2],
                                source: 'made up',
                                relevance_score: 1,
                                url: undefined,
                                snippets: [
                                    { text: 'document 3', corresponding_span_text: 'span 3' },
                                ],
                            },
                            4: {
                                index: '4',
                                text: 'document 4',
                                text_long: 'document 4 span 4',
                                corresponding_span_texts: ['span 4'],
                                corresponding_spans: [3],
                                source: 'made up',
                                relevance_score: 0.9,
                                url: undefined,
                                snippets: [
                                    { text: 'document 4', corresponding_span_text: 'span 4' },
                                ],
                            },
                            5: {
                                index: '5',
                                text: 'document 5',
                                text_long: 'document 5 span 5',
                                corresponding_span_texts: ['span 5'],
                                corresponding_spans: [4],
                                source: 'made up',
                                relevance_score: 0.7,
                                url: undefined,
                                snippets: [
                                    { text: 'document 5', corresponding_span_text: 'span 5' },
                                ],
                            },
                        } satisfies Record<string, Document>,
                    },
                },
            },
        };

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionDrawerDocumentList />
            </FakeAppContextProvider>
        );
        // If these are null something's wrong with the test anyway
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const documentCard1 = screen.getByText('"...document 1..."').parentElement!;
        const documentCard2 = screen.getByText('"...document 2..."').parentElement!;
        const documentCard3 = screen.getByText('"...document 3..."').parentElement!;
        const documentCard4 = screen.getByText('"...document 4..."').parentElement!;
        const documentCard5 = screen.getByText('"...document 5..."').parentElement!;
        /* eslint-enable@typescript-eslint/no-non-null-assertion */

        expect(documentCard1.compareDocumentPosition(documentCard2)).toEqual(
            // compareDocumentPosition returns the position of the element passed into the function
            Node.DOCUMENT_POSITION_FOLLOWING
        );
        expect(documentCard2.compareDocumentPosition(documentCard3)).toEqual(
            Node.DOCUMENT_POSITION_FOLLOWING
        );
        expect(documentCard3.compareDocumentPosition(documentCard4)).toEqual(
            Node.DOCUMENT_POSITION_FOLLOWING
        );
        expect(documentCard4.compareDocumentPosition(documentCard5)).toEqual(
            Node.DOCUMENT_POSITION_FOLLOWING
        );
    });

    it('should show an unavailable message if a model is not supported', () => {
        const initialState = {
            attribution: {
                selectedMessageId: 'message',
                attributionsByMessageId: {
                    message: {
                        loadingState: RemoteState.Error,
                        attributionRequestError: 'model-not-supported',
                    },
                },
            },
        } satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionDrawerDocumentList />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('This message used a model', { exact: false })).toBeVisible();
    });

    it('should show an blocked message if a message was blocked', () => {
        const initialState = {
            attribution: {
                selectedMessageId: 'message',
                attributionsByMessageId: {
                    message: {
                        loadingState: RemoteState.Error,
                        attributionRequestError: 'request-blocked',
                    },
                },
            },
        } satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionDrawerDocumentList />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('due to legal compliance', { exact: false })).toBeVisible();
    });

    it('should show an overloaded message if servers are overloaded', () => {
        const initialState = {
            attribution: {
                selectedMessageId: 'message',
                attributionsByMessageId: {
                    message: {
                        loadingState: RemoteState.Error,
                        attributionRequestError: 'overloaded',
                    },
                },
            },
        } satisfies ComponentProps<typeof FakeAppContextProvider>['initialState'];

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionDrawerDocumentList />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('currently overloaded', { exact: false })).toBeVisible();
    });
});
