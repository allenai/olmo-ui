import { ClientBase } from './ClientBase';
import type { SchemaAuthenticatedClient } from './playgroundApi/playgroundApiSchema';

export const WhoamiApiUrl = `/v3/whoami`;
export const AcceptTermsAndConditionsUrl = `/v3/user`;
export const MigrateFromAnonymousUserUrl = '/v3/migrate-user';

export type User = SchemaAuthenticatedClient;

interface MigrationResponse {
    updated_user?: User | null;
    messages_updated_count: number;
}

export class UserClient extends ClientBase {
    whoAmI = () => {
        const url = this.createURL(WhoamiApiUrl);

        return this.fetch<User>(url);
    };

    acceptTermsAndConditions = async () => {
        try {
            const url = this.createURL(AcceptTermsAndConditionsUrl);
            const dateTime = new Date().toISOString();
            const request = {
                termsAcceptedDate: dateTime,
            };

            const response = await this.fetch(url, {
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

    migrateFromAnonymousUser = async (authenticatedUserId: string) => {
        const url = this.createURL(MigrateFromAnonymousUserUrl);

        const request = {
            anonymous_user_id: this.anonymousUserId,
            new_user_id: authenticatedUserId,
        };

        const response = await this.fetch<MigrationResponse>(url, {
            method: 'PUT',
            body: JSON.stringify(request),
        });

        return response;
    };
}
