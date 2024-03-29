import { StateCreator } from 'zustand';

import { search } from '../api/dolma/search';

import { SearchClient } from '../api/dolma/SearchClient';

import { RemoteState } from '../contexts/util';

enum ActionType {
    NewSearch,
    SearchResponse,
    SearchError,
}

// interface NewSearch {
//     type: ActionType.NewSearch;
//     request: search.Request;
// }

// interface SearchOk {
//     type: ActionType.SearchResponse;
//     request: search.Request;
//     response: search.Response;
// }

// interface SearchError {
//     type: ActionType.SearchError;
//     request: search.Request;
//     error: Error;
// }

export interface SearchSlice {
    searchState: RemoteState;
    doSearch(request: search.Request): Promise<search.Response | Error>
    type?: ActionType;
    request?: search.Request;
    error?: Error;
    response?: search.Response;

}

// function reducer(state: State, action: NewSearch | SearchOk | SearchError): State {
//     switch (action.type) {
//         case ActionType.NewSearch: {
//             return { state: RemoteState.Loading, request: action.request, error: undefined };
//         }
//         case ActionType.SearchResponse: {
//             // Discard out of order responses
//             if (action.request !== state.request) {
//                 return state;
//             }
//             return { ...state, state: RemoteState.Loaded, response: action.response };
//         }
//         case ActionType.SearchError: {
//             // Discard out of order errors
//             if (action.request !== state.request) {
//                 return state;
//             }
//             return { ...state, state: RemoteState.Error, error: action.error };
//         }
//     }
// }

// export const SearchStore = ({ children }: { children: React.ReactNode }) => {
//     const [state, dispatch] = useReducer(reducer, defaultState);

//     const doSearch = async (request: search.Request) => {
//         dispatch({ type: ActionType.NewSearch, request });
//         try {
//             const api = new SearchClient();
//             const response = await api.search(request);
//             dispatch({ type: ActionType.SearchResponse, request, response });
//             return response;
//         } catch (e) {
//             const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
//             dispatch({ type: ActionType.SearchError, request, error });
//             throw error;
//         }
//     };
// }

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