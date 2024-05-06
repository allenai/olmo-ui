import { OlmoStateCreator } from '@/AppContext';

import { Schema, SchemaClient } from '../api/Schema';
import { WhoamiApiUrl } from '../api/User';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './AlertMessageSlice';

export interface SchemaSlice {
    schemaRemoteState?: RemoteState;
    schema: Schema | null;
    getSchema: () => Promise<void>;
}

const schemaClient = new SchemaClient();

export const createSchemaSlice: OlmoStateCreator<SchemaSlice> = (set, get) => ({
    schemaRemoteState: undefined,
    schema: null,
    getSchema: async () => {
        const { addAlertMessage } = get();
        set({ schemaRemoteState: RemoteState.Loading });
        try {
            const schema = await schemaClient.getSchema();

            set({
                schema,
                schemaRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addAlertMessage(
                errorToAlert(
                    `fetch-${WhoamiApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting schema.`,
                    err
                )
            );
            set({ schemaRemoteState: RemoteState.Error });
        }
    },
});
