// @vitest-environment happy-dom
// jsdom doesn't support IntersectionObserver

import { render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';

import * as authLoaders from '@/api/auth/auth-loaders';
import { Role } from '@/api/Role';
import * as appContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';

import { ATTRIBUTION_DRAWER_ID } from '../attribution/drawer/AttributionDrawer';
import { ThreadDisplayContainer } from './ThreadDisplayContainer';

describe('ThreadDisplay', () => {
    beforeEach(() => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(getFakeUseUserAuthInfo());
    });

    // TODO: Temp - These tests are skipped during the Zustand to React Query migration
    // They can be fixed once the direct React Query utility hooks are implemented
    // and the ThreadDisplayContainer is updated to use those hooks instead of Zustand state.
    it.skip('should highlight spans that contain special regex characters', () => {
        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: {
                        client: 'currentUser',
                        hasAcceptedTermsAndConditions: true,
                    },
                    currentOpenDrawer: ATTRIBUTION_DRAWER_ID,
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
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '(parens)',
                                            },
                                        ],
                                    },
                                    1: {
                                        documents: [0],
                                        text: '[braces]',
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '[braces]',
                                            },
                                        ],
                                    },
                                    2: {
                                        documents: [0],
                                        text: '.dot',
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '.dot',
                                            },
                                        ],
                                    },
                                    3: {
                                        documents: [0],
                                        text: '*star',
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '*star',
                                            },
                                        ],
                                    },
                                    4: {
                                        documents: [0],
                                        text: '|pipe',
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '|pipe',
                                            },
                                        ],
                                    },
                                    5: {
                                        documents: [0],
                                        text: '\\backslash',
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '\\backslash',
                                            },
                                        ],
                                    },
                                    6: {
                                        documents: [0],
                                        text: '"quotes"',
                                        nested_spans: [
                                            {
                                                documents: [0],
                                                text: '"quotes"',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                }}>
                <MemoryRouter initialEntries={[links.thread('userMessage')]}>
                    <ThreadDisplayContainer />
                </MemoryRouter>
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        logToggles: false,
                        isCorpusLinkEnabled: true,
                        isDatasetExplorerEnabled: true,
                    },
                },
            }
        );
        
        expect.soft(screen.getByText('(parens)')).toHaveRole('button');
        expect.soft(screen.getByText('[braces]')).toHaveRole('button');
        expect.soft(screen.getByText('.dot')).toHaveRole('button');
        expect.soft(screen.getByText('*star')).toHaveRole('button');
        expect.soft(screen.getByText('|pipe')).toHaveRole('button');
        expect.soft(screen.getByText('\\backslash')).toHaveRole('button');
        expect.soft(screen.getByText('"quotes"')).toHaveRole('button');
    });

    it.skip("shouldn't show system messages", () => {
        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: {
                        client: 'currentUser',
                        hasAcceptedTermsAndConditions: true,
                    },
                    selectedThreadRootId: 'systemMessage',
                    selectedThreadMessages: ['systemMessage', 'userMessage', 'llmMessage'],
                    selectedThreadMessagesById: {
                        systemMessage: {
                            id: 'systemMessage',
                            childIds: ['userMessage'],
                            selectedChildId: 'userMessage',
                            content: 'system message',
                            role: Role.System,
                            labels: [],
                            creator: 'currentUser',
                            isLimitReached: false,
                            isOlderThan30Days: false,
                        },
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
                            parent: 'systemMessage',
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
                }}>
                <MemoryRouter initialEntries={[links.thread('userMessage')]}>
                    <ThreadDisplayContainer />
                </MemoryRouter>
            </FakeAppContextProvider>
        );
        
        expect(screen.getByText('user prompt')).toBeInTheDocument();
        expect(screen.queryByText('system message')).not.toBeInTheDocument();
    });
});
