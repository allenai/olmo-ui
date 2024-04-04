import { StateCreator } from 'zustand';

import { search } from '../api/dolma/search';
import { SearchClient } from '../api/dolma/SearchClient';
import { RemoteState } from '../contexts/util';

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

interface GetDocumentRequest {
    id: string;
    query?: string;
}

export interface DocumentSlice {
    documentState: RemoteState;
    type?: ActionType;
    getDocument(request: GetDocumentRequest): Promise<search.Document>;
    documentRequest?: GetDocumentRequest;
    documentError?: Error;
    document?: search.Document;
}

export const createDocumentSlice: StateCreator<DocumentSlice> = (set) => {
    return {
        documentState: RemoteState.Loading,
        getDocument: async (request: GetDocumentRequest) => {
            set({
                documentState: RemoteState.Loading,
                type: ActionType.GetDocument,
                documentRequest: request,
            });

            const api = new SearchClient();
            // If the associated search query is set, use the search API so that
            // the response includes highlights.
            try {
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
                    set({
                        type: ActionType.GetDocumentOk,
                        request,
                        document,
                    });
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
        },
    };
};
