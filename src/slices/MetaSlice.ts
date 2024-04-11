import { search } from '../api/dolma/search';

import { SearchClient } from '../api/dolma/SearchClient';

import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '../contexts/util';

export interface MetaSlice {
    metaState: RemoteState;
    error?: Error;
    meta?: search.IndexMeta;
    getMeta(): Promise<search.IndexMeta | Error>;
}

export const createMetaSlice: OlmoStateCreator<MetaSlice> = (set) => ({
    metaState: RemoteState.Loading,
    getMeta: async () => {
        set({ metaState: RemoteState.Loading, error: undefined });
        try {
            const api = new SearchClient();
            const meta = await api.getMeta();
            set({ metaState: RemoteState.Loaded, meta });
            return meta;
        } catch (e) {
            const error = !(e instanceof Error) ? new Error(`Unknown Error: ${e}`) : e;
            set({ metaState: RemoteState.Error, error });
            return error;
        }
    },
});
