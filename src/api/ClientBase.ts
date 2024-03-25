import { error } from './error';

export abstract class ClientBase {
    constructor(readonly origin = process.env.LLMX_API_URL) {}

    protected login(dest: string = document.location.toString()) {
        const url = this.createURL('/v3/login/skiff');
        if (dest) {
            url.searchParams.set('dest', dest);
        }

        document.location = url.toString();
    }

    private unpack = async <T>(response: Response): Promise<T> => {
        switch (response.status) {
            case 200:
                return await response.json();
            case 401:
                this.login();
                // This shouldn't ever happen
                throw new Error('Unauthorized');
            default:
                throw await error.unpack(response);
        }
    };

    /**
     * Your standard JS fetch but with OLMO UI error, auth, and type handling. Accepts the same parameters as normal fetch
     * @returns The JSON response body of the response typed as the type you passed in
     */
    protected fetch = async <T>(
        url: Parameters<typeof fetch>[0],
        opts: Parameters<typeof fetch>[1] = {}
    ): Promise<T> => {
        const clonedOpts = { ...opts };

        const headers = new Headers(opts.headers);
        headers.set('Content-Type', 'application/json');
        clonedOpts.headers = headers;

        if (!('credentials' in opts)) {
            clonedOpts.credentials = 'include';
        }

        const response = await fetch(url, clonedOpts);
        return this.unpack<T>(response);
    };

    /**
     * @description A utility like `path.join` that'll accept path parts and append them to the base URL of the client
     * @param paths The path parts for your URL as strings
     * @returns URL of the origin + the path parts
     */
    protected createURL = (...paths: string[]) => {
        const joinedPaths = paths.join('/');

        return new URL(joinedPaths, this.origin);
    };
}
