// util functions to be used by contexts.

import React from 'react';

// global state of the store.
export enum RemoteState {
    Loading,
    Loaded,
    Error,
}

// return a react useContext wrapped with a check for missing provider.
// this is so we can generate a context with 'undefined' type and not have to write out all defaults.
// this may seem silly, but it tends to be a lot of extra writing of default functions that are never used.
export const ensureContext = <P>(con: React.Context<P | undefined>, label: string): P => {
    const context = React.useContext(con);
    if (!context) {
        throw new Error(`use${label} must be used within a ${label}Provider`);
    }
    return context;
};
