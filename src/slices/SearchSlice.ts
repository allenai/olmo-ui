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
    doSearch(request: search.Request): Promise<search.Response | Error>
    type?: ActionType;
    request?: search.Request;
    error?: Error;
    response?: search.Response;

}

export const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
    searchState: RemoteState.Loading,
    doSearch: async (request: search.Request) => {
        set({ searchState: RemoteState.Loading, type: ActionType.NewSearch, request });
        try {
            const api = new SearchClient();
            const response = await api.search(request);
            set({ searchState: RemoteState.Loaded, type: ActionType.SearchResponse, request, response });
            return response;
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            set({ searchState: RemoteState.Error, type: ActionType.SearchError, request, error });
            return error;
        }
    },
});