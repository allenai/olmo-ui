import { createContext, useState, useContext } from 'react';

import { RemoteState } from '../api/dolma/RemoteState';
import { SearchClient } from '../api/dolma/SearchClient';
import { search } from '../api/dolma/search';
import { UnimplementedError } from './UnimplementedError';

interface State {
    state: RemoteState;
    error?: Error;
    meta?: search.IndexMeta;
}

interface ContextState extends State {
    getMeta(): Promise<search.IndexMeta | Error>;
}
const defaultState = { state: RemoteState.Loading };
export const MetaStoreContext = createContext<ContextState>({
    ...defaultState,
    getMeta: () => Promise.reject(new UnimplementedError()),
});

export const MetaStore = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<State>(defaultState);

    const getMeta = async () => {
        setState({ state: RemoteState.Loading, error: undefined });
        try {
            const api = new SearchClient();
            const meta = await api.getMeta();
            setState({ state: RemoteState.Ok, meta });
            return meta;
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            setState({ state: RemoteState.Error, error });
            return error;
        }
    };

    return (
        <MetaStoreContext.Provider value={{ ...state, getMeta }}>
            {children}
        </MetaStoreContext.Provider>
    );
};

export const useMetaStore = () => useContext(MetaStoreContext);
