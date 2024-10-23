import { render, screen } from '@test-utils';

import * as authLoaders from '@/api/auth/auth-loaders';
import { Role } from '@/api/Role';
import * as appContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { useFakeUserAuthInfo } from '@/utils/FakeAuthLoaders';

import { ThreadDisplay } from './ThreadDisplay';

describe('ThreadDisplay', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should highlight spans that contain special regex characters', () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(useFakeUserAuthInfo);

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
                            content: '(parens) [braces] .dot *star |pipe \\backslash "quotes"',
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
                                documents: {},
                                spans: {
                                    0: {
                                        documents: [0],
                                        text: '(parens)',
                                    },
                                    1: {
                                        documents: [0],
                                        text: '[braces]',
                                    },
                                    2: {
                                        documents: [0],
                                        text: '.dot',
                                    },
                                    3: {
                                        documents: [0],
                                        text: '*star',
                                    },
                                    4: {
                                        documents: [0],
                                        text: '|pipe',
                                    },
                                    5: {
                                        documents: [0],
                                        text: '\\backslash',
                                    },
                                    6: {
                                        documents: [0],
                                        text: '"quotes"',
                                    },
                                },
                            },
                        },
                    },
                }}>
                <ThreadDisplay />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        logToggles: false,
                        attribution: true,
                        attributionSpanFirst: true,
                    },
                },
            }
        );

        expect.soft(screen.getByText('(parens)')).toHaveRole('button');
        expect.soft(screen.getByText('[braces]')).toHaveRole('button');
        expect.soft(screen.getByText('.dot')).toHaveRole('button');
        // this one is special because we need to escape markdown stuff, the * gets rendered right in front of it
        expect.soft(screen.getByText('star')).toHaveRole('button');
        expect.soft(screen.getByText('|pipe')).toHaveRole('button');
        expect.soft(screen.getByText('\\backslash')).toHaveRole('button');
        expect.soft(screen.getByText('"quotes"')).toHaveRole('button');
    });
});
