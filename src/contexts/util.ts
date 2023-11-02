// util functions to be used by contexts.

import React from 'react';

// global state of the store.
export enum RemoteState {
    Loading,
    Loaded,
    Error,
}

// return a react useContext wrapped with a check for missing provider.
export const useContext = <P>(con: React.Context<P | undefined>, label: string): P => {
    const context = React.useContext(con);
    if (!context) {
        throw new Error(`use${label} must be used within a ${label}Provider`);
    }
    return context;
};

// For immutability of react context arrrays, replace an item (or add new) in an array of T.
export const replaceItemInArray = <T extends { id: string }>(array: T[], newVal: T) => {
    const foundIndex = array.findIndex((v) => v.id === newVal.id);
    return [...array.slice(0, foundIndex), newVal, ...array.slice(foundIndex + 1)];
};
