import { StateCreator } from 'zustand';

import { search } from '../api/dolma/search';
import { SearchClient } from '../api/dolma/SearchClient';
import { RemoteState } from '../contexts/util';

enum ActionType {
    NewSearch,
    SearchResponse,
    SearchError,
}

export interface SearchSlice {
    searchState: RemoteState;
    doSearch(request: search.Request): Promise<search.Response | Error>;
    type?: ActionType;
    searchRequest?: search.Request;
    searchError?: Error;
    searchResponse?: search.Response;
}

export const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
    searchState: RemoteState.Loading,
    doSearch: async (searchRequest: search.Request) => {
        set({ searchState: RemoteState.Loading, type: ActionType.NewSearch, searchRequest });
        try {
            const api = new SearchClient();
            const searchResponse = await api.search(searchRequest);
            set({
                searchState: RemoteState.Loaded,
                type: ActionType.SearchResponse,
                searchRequest,
                searchResponse,
            });
            return searchResponse;
        } catch (e) {
            const searchError = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            set({
                searchState: RemoteState.Error,
                type: ActionType.SearchError,
                searchRequest,
                searchError,
            });
            throw searchError;
        }
    },
});
