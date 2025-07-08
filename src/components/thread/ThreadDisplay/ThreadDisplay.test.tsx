// @vitest-environment happy-dom
// jsdom doesn't support IntersectionObserver

import { render, screen, setupMswThreadHandler, waitFor } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';

import * as authLoaders from '@/api/auth/auth-loaders';
import { Role } from '@/api/Role';
import * as appContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { firstThreadMessageId } from '@/mocks/handlers/v4ThreadHandlers';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { getFakeUseUserAuthInfo } from '@/utils/FakeAuthLoaders';

import { ATTRIBUTION_DRAWER_ID } from '../attribution/drawer/AttributionDrawer';
import { ThreadDisplayContainer } from './ThreadDisplayContainer';

// Use a custom thread ID for the regex test to avoid MSW conflicts
const regexTestThreadId = 'test_regex_thread';

// Mock react-router-dom functions that ThreadDisplayContainer uses
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useParams: vi.fn(),
        useLoaderData: () => ({ selectedModelId: 'tulu2' }),
        useSearchParams: () => [new URLSearchParams(), vi.fn()],
    };
});

describe('ThreadDisplay', () => {
    beforeEach(() => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);
        vi.spyOn(authLoaders, 'useUserAuthInfo').mockImplementation(getFakeUseUserAuthInfo());
    });

    it('should highlight spans that contain special regex characters', async () => {
        const { useParams } = await import('react-router-dom');
        vi.mocked(useParams).mockReturnValue({ id: regexTestThreadId });

        // Set up MSW handler for our custom thread ID with regex character content
        setupMswThreadHandler(regexTestThreadId, [
            {
                id: regexTestThreadId,
                creator: 'currentUser',
                content: 'System message',
                role: 'system',
                children: ['userMessage'],
            },
            {
                id: 'userMessage',
                creator: 'currentUser',
                content: 'user prompt',
                role: 'user',
                parent: regexTestThreadId,
                children: ['llmMessage'],
            },
            {
                id: 'llmMessage',
                creator: 'currentUser',
                content: '(parens) [braces] .dot *star |pipe \\backslash "quotes"',
                role: 'assistant',
                parent: 'userMessage',
                children: null,
            },
        ]);

        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: {
                        client: 'currentUser',
                        hasAcceptedTermsAndConditions: true,
                    },
                    currentOpenDrawer: ATTRIBUTION_DRAWER_ID,
                    selectedThreadRootId: regexTestThreadId,
                    selectedThreadMessages: [regexTestThreadId, 'userMessage', 'llmMessage'],
                    selectedThreadMessagesById: {
                        [regexTestThreadId]: {
                            id: regexTestThreadId,
                            childIds: ['userMessage'],
                            selectedChildId: 'userMessage',
                            content: 'System message',
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
                            parent: regexTestThreadId,
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
                    addSnackMessage: vi.fn(),
                    setIsShareReady: vi.fn(),
                }}>
                <MemoryRouter initialEntries={[links.thread(regexTestThreadId)]}>
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

        await waitFor(() => {
            expect(screen.getByText('user prompt')).toBeInTheDocument();
        });

        // Verify that attribution highlighting works with regex special characters
        expect.soft(screen.getByText('(parens)')).toHaveRole('button');
        expect.soft(screen.getByText('[braces]')).toHaveRole('button');
        expect.soft(screen.getByText('.dot')).toHaveRole('button');
        expect.soft(screen.getByText('*star')).toHaveRole('button');
        expect.soft(screen.getByText('|pipe')).toHaveRole('button');
        expect.soft(screen.getByText('\\backslash')).toHaveRole('button');
        expect.soft(screen.getByText('"quotes"')).toHaveRole('button');
    });

    it("shouldn't show system messages", async () => {
        const { useParams } = await import('react-router-dom');
        vi.mocked(useParams).mockReturnValue({ id: firstThreadMessageId });

        render(
            <FakeAppContextProvider
                initialState={{
                    userInfo: {
                        client: 'currentUser',
                        hasAcceptedTermsAndConditions: true,
                    },
                    selectedThreadRootId: firstThreadMessageId,
                    selectedThreadMessages: [
                        firstThreadMessageId,
                        'msg_G8D2Q9Y8Q4',
                        'msg_D6H1N4L6L2',
                    ],
                    selectedThreadMessagesById: {
                        [firstThreadMessageId]: {
                            id: firstThreadMessageId,
                            childIds: ['msg_G8D2Q9Y8Q4'],
                            selectedChildId: 'msg_G8D2Q9Y8Q4',
                            content: 'System message',
                            role: Role.System,
                            labels: [],
                            creator: 'murphy@allenai.org',
                            isLimitReached: false,
                            isOlderThan30Days: false,
                        },
                        msg_G8D2Q9Y8Q4: {
                            id: 'msg_G8D2Q9Y8Q4',
                            childIds: ['msg_D6H1N4L6L2'],
                            selectedChildId: 'msg_D6H1N4L6L2',
                            content: 'First existing message',
                            role: Role.User,
                            labels: [],
                            creator: 'murphy@allenai.org',
                            isLimitReached: false,
                            isOlderThan30Days: false,
                            parent: firstThreadMessageId,
                        },
                        msg_D6H1N4L6L2: {
                            id: 'msg_D6H1N4L6L2',
                            childIds: [],
                            content: 'Ether',
                            role: Role.LLM,
                            labels: [],
                            creator: 'murphy@allenai.org',
                            isLimitReached: false,
                            isOlderThan30Days: false,
                            parent: 'msg_G8D2Q9Y8Q4',
                        },
                    },
                    addSnackMessage: vi.fn(),
                    setIsShareReady: vi.fn(),
                }}>
                <MemoryRouter initialEntries={[links.thread(firstThreadMessageId)]}>
                    <ThreadDisplayContainer />
                </MemoryRouter>
            </FakeAppContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('First existing message')).toBeInTheDocument();
        });

        expect(screen.getByText('First existing message')).toBeInTheDocument();
        expect(screen.queryByText('System message')).not.toBeInTheDocument();
    });
});
