import { render, screen } from '@test-utils';

import { Document } from '@/api/AttributionClient';
import * as appContext from '@/AppContext';
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
            attribution: {
                selectedMessageId: 'message',
                attributionsByMessageId: {
                    message: {
                        orderedDocumentIndexes: documentOrder,
                        documents: {
                            1: {
                                index: '1',
                                text: 'document 1',
                                corresponding_span_texts: ['span 1'],
                                corresponding_spans: [0],
                                source: 'made up',
                                relevance_score: 5,
                                url: undefined,
                                snippets: [
                                    { text: 'document 1', corresponding_span_text: 'span 1' },
                                ],
                            },
                            2: {
                                index: '2',
                                text: 'document 2',
                                corresponding_span_texts: ['span 2'],
                                corresponding_spans: [1],
                                source: 'made up',
                                relevance_score: 4,
                                url: undefined,
                                snippets: [
                                    { text: 'document 2', corresponding_span_text: 'span 2' },
                                ],
                            },
                            3: {
                                index: '3',
                                text: 'document 3',
                                corresponding_span_texts: ['span 3'],
                                corresponding_spans: [2],
                                source: 'made up',
                                relevance_score: 3,
                                url: undefined,
                                snippets: [
                                    { text: 'document 3', corresponding_span_text: 'span 3' },
                                ],
                            },
                            4: {
                                index: '4',
                                text: 'document 4',
                                corresponding_span_texts: ['span 4'],
                                corresponding_spans: [3],
                                source: 'made up',
                                relevance_score: 2,
                                url: undefined,
                                snippets: [
                                    { text: 'document 4', corresponding_span_text: 'span 4' },
                                ],
                            },
                            5: {
                                index: '5',
                                text: 'document 5',
                                corresponding_span_texts: ['span 5'],
                                corresponding_spans: [4],
                                source: 'made up',
                                relevance_score: 1,
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

    it('should deduplicate documents with the same URL', () => {
        const initialState = {
            attribution: {
                selectedMessageId: 'message',
                attributionsByMessageId: {
                    message: {
                        orderedDocumentIndexes: ['1', '2', '3', '4', '5'],

                        documents: {
                            1: {
                                index: '1',
                                text: 'document 1',
                                corresponding_span_texts: ['span 1'],
                                corresponding_spans: [0],
                                source: 'made up',
                                relevance_score: 5,
                                url: 'https://fake.website',
                                snippets: [
                                    { text: 'document 1', corresponding_span_text: 'span 1' },
                                ],
                            },
                            2: {
                                index: '2',
                                text: 'document 2',
                                corresponding_span_texts: ['span 2'],
                                corresponding_spans: [1],
                                source: 'made up',
                                relevance_score: 4,
                                url: 'https://fake.website',
                                snippets: [
                                    { text: 'document 2', corresponding_span_text: 'span 2' },
                                ],
                            },
                            3: {
                                index: '3',
                                text: 'document 3',
                                corresponding_span_texts: ['span 3'],
                                corresponding_spans: [2],
                                source: 'made up',
                                relevance_score: 3,
                                url: 'https://fake.website',
                                snippets: [
                                    { text: 'document 3', corresponding_span_text: 'span 3' },
                                ],
                            },
                            4: {
                                index: '4',
                                text: 'document 4',
                                corresponding_span_texts: ['span 4'],
                                corresponding_spans: [3],
                                source: 'made up',
                                relevance_score: 2,
                                url: undefined,
                                snippets: [
                                    { text: 'document 4', corresponding_span_text: 'span 4' },
                                ],
                            },
                            5: {
                                index: '5',
                                text: 'document 5',
                                corresponding_span_texts: ['span 5'],
                                corresponding_spans: [4],
                                source: 'made up',
                                relevance_score: 1,
                                url: 'https://another.fake.website',
                                snippets: [
                                    { text: 'document 5', corresponding_span_text: 'span 5' },
                                ],
                            },
                        },
                    },
                },
            },
        };

        render(
            <FakeAppContextProvider initialState={initialState}>
                <AttributionDrawerDocumentList />
            </FakeAppContextProvider>
        );

        const corpusLinkDocuments = screen.getAllByRole('listitem');

        expect(corpusLinkDocuments).toHaveLength(3);
        expect(corpusLinkDocuments[0]).toHaveTextContent('document 1');
        expect(corpusLinkDocuments[0]).toHaveTextContent('Document repeated 3 times in result');
    });
});
