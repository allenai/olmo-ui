import type {
    SchemaAuthenticatedClient as AuthenticatedClient,
    SchemaUpsertUserRequest as UpsertUserRequest,
    SchemaUpsertUserResponse as UpsertUserResponse,
    SchemaUserMigrationRequest as MigrationRequest,
    SchemaUserMigrationResponse as MigrationResponse,
} from '@/api/playgroundApi/v5playgroundApiSchema';

import { ClientBase } from './ClientBase';

export const WhoamiApiUrl = `/v5/user/whoami`;
export const UpdateUserUrl = `/v5/user/`;
export const MigrateFromAnonymousUserUrl = '/v5/user/migration';

export type User = AuthenticatedClient;

export class UserClient extends ClientBase {
    whoAmI = () => {
        const url = this.createURL(WhoamiApiUrl);

        return this.fetch<User>(url);
    };

    updateUserTermsAndDataCollection = async ({
        termsAccepted,
        dataCollectionAccepted,
        mediaCollectionAccepted,
    }: {
        termsAccepted?: boolean;
        dataCollectionAccepted?: boolean;
        mediaCollectionAccepted?: boolean;
    }) => {
        try {
            const url = this.createURL(UpdateUserUrl);
            const dateTime = new Date().toISOString();
            const request: UpsertUserRequest = {
                ...(dataCollectionAccepted === true && { dataCollectionAcceptedDate: dateTime }),
                ...(dataCollectionAccepted === false && {
                    dataCollectionAcceptanceRevokedDate: dateTime,
                }),
                ...(mediaCollectionAccepted === true && { mediaCollectionAcceptedDate: dateTime }),
                ...(mediaCollectionAccepted === false && {
                    mediaCollectionAcceptanceRevokedDate: dateTime,
                }),
                ...(termsAccepted === true && { termsAcceptedDate: dateTime }),
                ...(termsAccepted === false && { termsAcceptanceRevokedDate: dateTime }),
            };

            const response = await this.fetch<UpsertUserResponse>(url, {
                method: 'PUT',
                body: JSON.stringify(request),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            return response;
        } catch (e: unknown) {
            console.error(e);
        }
    };

    migrateFromAnonymousUser = async () => {
        const url = this.createURL(MigrateFromAnonymousUserUrl);

        const request: MigrationRequest = {
            anonymousUserId: this.anonymousUserId,
        };

        const response = await this.fetch<MigrationResponse>(url, {
            method: 'PUT',
            body: JSON.stringify(request),
        });

        return response;
    };
}
