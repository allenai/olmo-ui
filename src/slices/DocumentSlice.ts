import { OlmoStateCreator } from '@/AppContext';

import { search } from '../api/dolma/search';
import { SearchClient } from '../api/dolma/SearchClient';
import { RemoteState } from '../contexts/util';

interface GetDocumentRequest {
    id: string;
    query?: string;
}

export interface DocumentSlice {
    documentState: RemoteState;
    getDocument: (request: GetDocumentRequest) => Promise<search.Document>;
    documentRequest?: GetDocumentRequest;
    documentError?: Error;
    document?: search.Document;
}

export const createDocumentSlice: OlmoStateCreator<DocumentSlice> = (set) => ({
    documentState: RemoteState.Loading,
    getDocument: async (request: GetDocumentRequest) => {
        set({
            documentState: RemoteState.Loading,
            documentRequest: request,
            documentError: undefined,
        });

        const api = new SearchClient();
        try {
            const document = await api.getDocument(request.id, {
                query: request.query,
            });
            set({
                documentState: RemoteState.Loaded,
                documentRequest: request,
                document,
            });

            return document;
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            set({
                documentState: RemoteState.Error,
                documentRequest: request,
                documentError: error,
            });
            throw error;
        }
    },
});
