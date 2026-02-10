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
        expect(screen.getByTestId('olmotrace-drawer')).toBeVisible();
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
        expect(screen.getByTestId('olmotrace-drawer')).not.toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Back to all documents' }));

        expect(screen.getByTestId('olmotrace-drawer')).toBeVisible();
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
                        textLong: 'document 1 span 1',
                        correspondingSpanTexts: ['span 1'],
                        correspondingSpans: [0],
                        source: 'made up',
                        usage: 'Pre-training',
                        displayName: 'Made-up source',
                        sourceUrl: 'http://made_up',
                        relevanceScore: 1.5,
                        url: 'https://fake.website',
                        snippets: [{ text: 'document 1', correspondingSpanText: 'span 1' }],
                    },
                    2: {
                        index: '2',
                        textLong: 'document 2 span 2',
                        correspondingSpanTexts: ['span 2'],
                        correspondingSpans: [1],
                        source: 'made up',
                        usage: 'Pre-training',
                        displayName: 'Made-up source',
                        sourceUrl: 'http://made_up',
                        relevanceScore: 1.2,
                        url: 'https://fake.website',
                        snippets: [{ text: 'document 2', correspondingSpanText: 'span 2' }],
                    },
                    3: {
                        index: '3',
                        textLong: 'document 3 span 3',
                        correspondingSpanTexts: ['span 3'],
                        correspondingSpans: [2],
                        source: 'made up',
                        usage: 'Pre-training',
                        displayName: 'Made-up source',
                        sourceUrl: 'http://made_up',
                        relevanceScore: 1,
                        url: 'https//fake.website',
                        snippets: [{ text: 'document 3', correspondingSpanText: 'span 3' }],
                    },
                    4: {
                        index: '4',
                        textLong: 'document 4 span 4',
                        correspondingSpanTexts: ['span 4'],
                        correspondingSpans: [3],
                        source: 'made up',
                        usage: 'Pre-training',
                        displayName: 'Made-up source',
                        sourceUrl: 'http://made_up',
                        relevanceScore: 0.9,
                        url: undefined,
                        snippets: [{ text: 'document 4', correspondingSpanText: 'span 4' }],
                    },
                    5: {
                        index: '5',
                        textLong: 'document 5 span 5',
                        correspondingSpanTexts: ['span 5'],
                        correspondingSpans: [4],
                        source: 'made up',
                        usage: 'Pre-training',
                        displayName: 'Made-up source',
                        sourceUrl: 'http://made_up',
                        relevanceScore: 0.7,
                        url: 'https://another.fake.website',
                        snippets: [{ text: 'document 5', correspondingSpanText: 'span 5' }],
                    },
                } satisfies Record<string, Document>,
            },
        },
    },
};
