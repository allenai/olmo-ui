// @vitest-environment happy-dom
// jsdom has a bug where it doesn't know how to check visibility of a visibility: hidden style inside a grid element
// so we're using happy-dom just in this file
// if we use happy-dom everywhere the TermsAndConditions test breaks lol

import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Role } from '@/api/Role';
import * as appContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { AttributionDocumentCard } from './AttributionDocumentCard';

describe('AttributionDocumentCard', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should show and hide extra snippets', async () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        const user = userEvent.setup();

        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: {
                        client: 'currentUser',
                        hasAcceptedTermsAndConditions: true,
                    },
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
                        },
                    },
                    attribution: {
                        selectedMessageId: 'llmMessage',
                        attributionsByMessageId: {
                            llmMessage: {
                                loadingState: RemoteState.Loaded,
                                documents: {
                                    12345: {
                                        corresponding_spans: [0, 1],
                                        corresponding_span_texts: [
                                            'This is a',
                                            'message from the LLM',
                                        ],
                                        index: '12345',
                                        source: 'c4',
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
                                    },
                                    1: {
                                        documents: [12345],
                                        text: 'message from the LLM',
                                    },
                                },
                            },
                        },
                    },
                }}>
                <AttributionDocumentCard source="Source" documentIndex="12345" numRepetitions={1} />
            </FakeAppContextProvider>
        );

        screen.debug();
        expect(screen.getByText('This is a')).toBeVisible();
        expect(screen.getByText('This is a')).toHaveStyle({ 'font-weight': '700' });
        expect(screen.queryByText('message from the LLM')).not.toBeVisible();

        await user.click(screen.getByRole('button', { name: 'Show more' }));

        expect(screen.getByText('message from the LLM')).toBeVisible();
        expect(screen.getByText('message from the LLM')).toHaveStyle({ 'font-weight': '700' });

        await user.click(screen.getByRole('button', { name: 'Show less' }));

        expect(screen.getByText('message from the LLM')).not.toBeVisible();
    });
});
