import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Document } from '@/api/AttributionClient';
import * as appContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { FullAttributionContent } from './AttributionContent';

describe('AttributionContent deduplication', () => {
    beforeEach(() => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should deduplicate documents with the same URL', () => {
        render(
            <FakeAppContextProvider initialState={initialStateWithDuplicateDocuments}>
                <FullAttributionContent />
            </FakeAppContextProvider>
        );

        const corpusLinkDocuments = screen.getAllByRole('listitem');

        expect(corpusLinkDocuments).toHaveLength(4);
        expect(corpusLinkDocuments[0]).toHaveTextContent('document 1');
        expect(corpusLinkDocuments[0]).toHaveTextContent('Document repeated 2 times in result');
    });

    it('opens the duplicate documents screen when clicking', async () => {
        const user = userEvent.setup();

        render(
            <FakeAppContextProvider initialState={initialStateWithDuplicateDocuments}>
                <FullAttributionContent />
            </FakeAppContextProvider>
        );

        // We're on the standard CorpusLink stuff
        expect(screen.getByTestId('corpuslink-drawer')).toBeVisible();
        const corpusLinkDocuments = screen.getAllByRole('listitem');

        expect(corpusLinkDocuments).toHaveLength(4);

        expect(
            within(corpusLinkDocuments[0]).getByText('Document repeated 2 times in result')
        ).toBeVisible();
        await user.click(
            within(corpusLinkDocuments[0]).getByRole('button', {
                name: 'View all repeated documents',
            })
        );

        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByTestId('corpuslink-drawer')).not.toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Back to all documents' }));

        expect(screen.getByTestId('corpuslink-drawer')).toBeVisible();
        expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });
});

const initialStateWithDuplicateDocuments = {
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
                orderedDocumentIndexes: ['1', '2', '3', '4', '5'],
                documents: {
                    1: {
                        index: '1',
                        text: 'document 1',
                        text_long: 'document 1 span 1',
                        corresponding_span_texts: ['span 1'],
                        corresponding_spans: [0],
                        source: 'made up',
                        relevance_score: 1.5,
                        url: 'https://fake.website',
                        snippets: [{ text: 'document 1', corresponding_span_text: 'span 1' }],
                    },
                    2: {
                        index: '2',
                        text: 'document 2',
                        text_long: 'document 2 span 2',
                        corresponding_span_texts: ['span 2'],
                        corresponding_spans: [1],
                        source: 'made up',
                        relevance_score: 1.2,
                        url: 'https://fake.website',
                        snippets: [{ text: 'document 2', corresponding_span_text: 'span 2' }],
                    },
                    3: {
                        index: '3',
                        text: 'document 3',
                        text_long: 'document 3 span 3',
                        corresponding_span_texts: ['span 3'],
                        corresponding_spans: [2],
                        source: 'made up',
                        relevance_score: 1,
                        url: 'https//fake.website',
                        snippets: [{ text: 'document 3', corresponding_span_text: 'span 3' }],
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
                        snippets: [{ text: 'document 4', corresponding_span_text: 'span 4' }],
                    },
                    5: {
                        index: '5',
                        text: 'document 5',
                        text_long: 'document 5 span 5',
                        corresponding_span_texts: ['span 5'],
                        corresponding_spans: [4],
                        source: 'made up',
                        relevance_score: 0.7,
                        url: 'https://another.fake.website',
                        snippets: [{ text: 'document 5', corresponding_span_text: 'span 5' }],
                    },
                } satisfies Record<string, Document>,
            },
        },
    },
};
