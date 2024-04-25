import { ClientBase } from './ClientBase';

export const WhoamiApiUrl = `/v3/whoami`;
export const AcceptTermsAndConditionsUrl = `/v3/user`;

export interface User {
    client: string;
    hasAcceptedTermsAndConditions: boolean;
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

            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(request),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`PUT ${url.toString()}: ${response.status} ${response.statusText}`);
            }
            if (!response.body) {
                throw new Error(`PUT ${url.toString()}: missing response body`);
            }

            return response;
        } catch (e: unknown) {
            console.error(e);
        }
    };
}
