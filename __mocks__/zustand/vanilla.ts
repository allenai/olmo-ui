import { act } from '@testing-library/react';
import * as ZustandVanillaExportedTypes from 'zustand/vanilla';
export * from 'zustand/vanilla';

const { createStore: actualCreateStore } =
    await vi.importActual<typeof ZustandVanillaExportedTypes>('zustand/vanilla');

// a variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

const createStoreUncurried = <T>(stateCreator: ZustandVanillaExportedTypes.StateCreator<T>) => {
    const store = actualCreateStore(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => {
        store.setState(initialState, true);
    });
    return store;
};

// when creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = (<T>(stateCreator: ZustandVanillaExportedTypes.StateCreator<T>) => {
    console.log('zustand/vanilla createStore mock');

    // to support curried version of createStore
    return typeof stateCreator === 'function'
        ? createStoreUncurried(stateCreator)
        : createStoreUncurried;
}) as typeof ZustandVanillaExportedTypes.createStore;

// reset all stores after each test run
afterEach(() => {
    act(() => {
        storeResetFns.forEach((resetFn) => {
            resetFn();
        });
    });
});
