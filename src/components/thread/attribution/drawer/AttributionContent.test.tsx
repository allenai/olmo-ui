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
        expect(screen.getByText('Text matches from pre-training data')).toBeVisible();
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
        expect(screen.getByText('Text matches from pre-training data')).not.toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Back to CorpusLink documents' }));

        expect(screen.getByText('Text matches from pre-training data')).toBeVisible();
        expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });
});

const initialStateWithDuplicateDocuments = {
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
                        snippets: [{ text: 'document 1', corresponding_span_text: 'span 1' }],
                    },
                    2: {
                        index: '2',
                        text: 'document 2',
                        corresponding_span_texts: ['span 2'],
                        corresponding_spans: [1],
                        source: 'made up',
                        relevance_score: 4,
                        url: 'https://fake.website',
                        snippets: [{ text: 'document 2', corresponding_span_text: 'span 2' }],
                    },
                    3: {
                        index: '3',
                        text: 'document 3',
                        corresponding_span_texts: ['span 3'],
                        corresponding_spans: [2],
                        source: 'made up',
                        relevance_score: 3,
                        url: 'https//fake.website',
                        snippets: [{ text: 'document 3', corresponding_span_text: 'span 3' }],
                    },
                    4: {
                        index: '4',
                        text: 'document 4',
                        corresponding_span_texts: ['span 4'],
                        corresponding_spans: [3],
                        source: 'made up',
                        relevance_score: 2,
                        url: undefined,
                        snippets: [{ text: 'document 4', corresponding_span_text: 'span 4' }],
                    },
                    5: {
                        index: '5',
                        text: 'document 5',
                        corresponding_span_texts: ['span 5'],
                        corresponding_spans: [4],
                        source: 'made up',
                        relevance_score: 1,
                        url: 'https://another.fake.website',
                        snippets: [{ text: 'document 5', corresponding_span_text: 'span 5' }],
                    },
                } satisfies Record<string, Document>,
            },
        },
    },
};
