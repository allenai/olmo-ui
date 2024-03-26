import { search } from "../api/dolma/search";
import { RemoteState } from "../api/dolma/RemoteState";

import { StateCreator } from 'zustand';
import { SearchClient } from "../api/dolma/SearchClient";

export interface MetaSlice {
    state: RemoteState;
    error?: Error;
    meta?: search.IndexMeta;
    getMeta(): Promise<search.IndexMeta | Error>;
}

export const createMetaSlice: StateCreator<MetaSlice> = (set) => ({
    state: RemoteState.Loading,
    getMeta: async() => {
        set({ state: RemoteState.Loading, error: undefined });
        try {
            const api = new SearchClient();
            const meta = await api.getMeta();
            set({ state: RemoteState.Ok, meta });
            return meta;
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            set({ state: RemoteState.Error, error });
            return error;
        }
    }
});