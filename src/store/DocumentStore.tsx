import React, { createContext, useReducer, useContext } from 'react';

import { RemoteState } from '../contexts/util';
import { SearchClient } from '../api/dolma/SearchClient';
import { search } from '../api/dolma/search';
import { UnimplementedError } from './UnimplementedError';

interface GetDocumentRequest {
    id: string;
    query?: string;
}

interface State {
    state: RemoteState;
    request?: GetDocumentRequest;
    error?: Error;
    document?: search.Document;
}

interface ContextState extends State {
    getDocument(req: GetDocumentRequest): Promise<search.Document>;
}
const defaultState = { state: RemoteState.Loading };
export const DocumentStoreContext = createContext<ContextState>({
    ...defaultState,
    getDocument: (_: GetDocumentRequest) => Promise.reject(new UnimplementedError()),
});

enum ActionType {
    GetDocument,
    GetDocumentOk,
    GetDocumentError,
}

interface GetDocument {
    type: ActionType.GetDocument;
    request: GetDocumentRequest;
}

interface GetDocumentOk {
    type: ActionType.GetDocumentOk;
    request: GetDocumentRequest;
    document: search.Document;
}

interface GetDocumentError {
    type: ActionType.GetDocumentError;
    request: GetDocumentRequest;
    error: Error;
}

function reducer(state: State, action: GetDocument | GetDocumentOk | GetDocumentError): State {
    switch (action.type) {
        case ActionType.GetDocument:
            return { state: RemoteState.Loading, request: action.request };
        case ActionType.GetDocumentOk:
            // Discard out of order responses
            if (state.request !== action.request) {
                return state;
            }
            return { ...state, state: RemoteState.Loaded, document: action.document };
        case ActionType.GetDocumentError:
            // Discard out of order errors
            if (state.request !== action.request) {
                return state;
            }
            return { ...state, state: RemoteState.Error, error: action.error };
    }
}

export const DocumentStore = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const getDocument = async (request: GetDocumentRequest) => {
        dispatch({ type: ActionType.GetDocument, request });
        try {
            const api = new SearchClient();
            // If the associated search query is set, use the search API so that
            // the response includes highlights.
            if (request.query) {
                const response = await api.search({
                    query: request.query,
                    offset: 0,
                    size: 1,
                    filters: { sources: [], ids: [request.id] },
                    match: search.MatchType.Should,
                    no_aggs: true,
                    snippet: search.SnippetType.Long,
                });
                if (response.meta.total !== 1) {
                    throw new Error('Not found');
                }
                const document = response.results[0];
                dispatch({ type: ActionType.GetDocumentOk, request, document });
                return document;
            } else {
                const document = await api.getDocument(request.id);
                dispatch({ type: ActionType.GetDocumentOk, request, document });
                return document;
            }
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            dispatch({ type: ActionType.GetDocumentError, request, error });
            throw error;
        }
    };

    return (
        <DocumentStoreContext.Provider value={{ ...state, getDocument }}>
            {children}
        </DocumentStoreContext.Provider>
    );
};

export const useDocumentStore = () => useContext(DocumentStoreContext);
