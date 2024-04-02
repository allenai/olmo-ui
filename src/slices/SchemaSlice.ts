import { StateCreator } from 'zustand';

import { AlertMessageSlice, errorToAlert } from './AlertMessageSlice';
import { RemoteState } from '../contexts/util';
import { WhoamiApiUrl } from '../api/User';
import { Schema, SchemaClient } from '../api/Schema';

export interface SchemaSlice {
    schemaRemoteState?: RemoteState;
    schema: Schema | null;
    getSchema: () => Promise<void>;
}

const schemaClient = new SchemaClient();

export const createSchemaSlice: StateCreator<
    SchemaSlice & AlertMessageSlice,
    [],
    [],
    SchemaSlice
> = (set, get) => ({
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
