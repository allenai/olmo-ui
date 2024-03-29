import React, { createContext, useReducer, useContext } from 'react';

import { RemoteState } from '../contexts/util';
import { SearchClient } from '../api/dolma/SearchClient';
import { search } from '../api/dolma/search';
import { UnimplementedError } from './UnimplementedError';

interface State {
    state: RemoteState;
    request: search.Request;
    error?: Error;
    response?: search.Response;
}

interface ContextState extends State {
    search(request: search.Request): Promise<search.Response>;
}
const defaultState = { state: RemoteState.Loading, request: { query: '' } };
export const SearchStoreContext = createContext<ContextState>({
    ...defaultState,
    search: () => Promise.reject(new UnimplementedError()),
});

enum ActionType {
    NewSearch,
    SearchResponse,
    SearchError,
}

interface NewSearch {
    type: ActionType.NewSearch;
    request: search.Request;
}

interface SearchOk {
    type: ActionType.SearchResponse;
    request: search.Request;
    response: search.Response;
}

interface SearchError {
    type: ActionType.SearchError;
    request: search.Request;
    error: Error;
}

function reducer(state: State, action: NewSearch | SearchOk | SearchError): State {
    switch (action.type) {
        case ActionType.NewSearch: {
            return { state: RemoteState.Loading, request: action.request, error: undefined };
        }
        case ActionType.SearchResponse: {
            // Discard out of order responses
            if (action.request !== state.request) {
                return state;
            }
            return { ...state, state: RemoteState.Loaded, response: action.response };
        }
        case ActionType.SearchError: {
            // Discard out of order errors
            if (action.request !== state.request) {
                return state;
            }
            return { ...state, state: RemoteState.Error, error: action.error };
        }
    }
}

export const SearchStore = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const doSearch = async (request: search.Request) => {
        dispatch({ type: ActionType.NewSearch, request });
        try {
            const api = new SearchClient();
            const response = await api.search(request);
            dispatch({ type: ActionType.SearchResponse, request, response });
            return response;
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            dispatch({ type: ActionType.SearchError, request, error });
            throw error;
        }
    };

    return (
        <SearchStoreContext.Provider value={{ ...state, search: doSearch }}>
            {children}
        </SearchStoreContext.Provider>
    );
};

export const useSearchStore = () => useContext(SearchStoreContext);
