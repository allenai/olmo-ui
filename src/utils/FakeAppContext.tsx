import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import * as appContext from '@/AppContext';

type AppContextStore = ReturnType<typeof appContext.createAppContext>;
const FakeAppContext = createContext<AppContextStore | null>(null);

export const FakeAppContextProvider = ({
    initialState,
    children,
}: PropsWithChildren<{
    initialState: Parameters<typeof appContext.createAppContext>[0];
}>) => {
    const storeRef = useRef<AppContextStore>(appContext.createAppContext(initialState));

    return <FakeAppContext.Provider value={storeRef.current}>{children}</FakeAppContext.Provider>;
};

export const useFakeAppContext = (selector: (state: appContext.AppContextState) => unknown) => {
    const store = useContext(FakeAppContext);

    if (store == null) {
        throw new Error("AppContext store wasn't initialized");
    }

    return useStore(store, selector);
};
