import { render, screen } from '@test-utils';
import { createContext, PropsWithChildren, ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { Role } from '@/api/Role';
import * as appContext from '@/AppContext';

import { ThreadDisplay } from './ThreadDisplay';

type AppContextStore = ReturnType<typeof appContext.createAppContext>;
const FakeAppContext = createContext<AppContextStore | null>(null);

const FakeAppContextProvider = ({
    initialState,
    children,
}: PropsWithChildren<{
    initialState: Partial<appContext.AppContextState>;
}>) => {
    const storeRef = useRef<AppContextStore>(appContext.createAppContext(initialState));

    return <FakeAppContext.Provider value={storeRef.current}>{children}</FakeAppContext.Provider>;
};

const useFakeAppContext = (selector: (state: appContext.AppContextState) => unknown) => {
    const store = useContext(FakeAppContext);

    if (store == null) {
        throw new Error("AppContext store wasn't initialized");
    }

    return useStore(store, selector);
};

describe('ThreadDisplay', () => {
    it('should highlight spans that contain special markdown characters', () => {
        vi.spyOn(appContext, 'useAppContext').mockImplementation(useFakeAppContext);

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
                            content: '(message) [] . *',
                            role: Role.LLM,
                            labels: [],
                            creator: 'currentUser',
                            isLimitReached: false,
                            isOlderThan30Days: false,
                            parent: 'userMessage',
                        },
                    },
                }}>
                <ThreadDisplay />
            </FakeAppContextProvider>
        );

        expect(screen.getByText('message')).toBeVisible();
    });
});
