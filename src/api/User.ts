import { ClientBase } from './ClientBase';

export const WhoamiApiUrl = `v3/whoami`;

export interface User {
    client: string;
}

export class UserClient extends ClientBase {
    whoAmI = () => {
        const url = this.createURL(WhoamiApiUrl);

        return this.fetch<User>(url);
    };
}
