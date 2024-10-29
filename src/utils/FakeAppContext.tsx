import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { DeepPartial } from 'react-hook-form';
import { useStore } from 'zustand';

import * as appContext from '@/AppContext';

type AppContextStore = ReturnType<typeof appContext.createAppContext>;
const FakeAppContext = createContext<AppContextStore | null>(null);

export const FakeAppContextProvider = ({
    initialState,
    children,
}: PropsWithChildren<{
    initialState: DeepPartial<appContext.AppContextState>;
}>) => {
    const storeRef = useRef<AppContextStore>(appContext.createAppContext(initialState));

    return <FakeAppContext.Provider value={storeRef.current}>{children}</FakeAppContext.Provider>;
};

export const FakeAppContextWithCustomStatesProvider = ({
    customStates,
    children,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: PropsWithChildren<{ customStates: any }>) => {
    return <FakeAppContext.Provider value={customStates}>{children}</FakeAppContext.Provider>;
};

export const useFakeAppContext = (selector: (state: appContext.AppContextState) => unknown) => {
    const store = useContext(FakeAppContext);

    if (store == null) {
        throw new Error("AppContext store wasn't initialized");
    }

    return useStore(store, selector);
};
