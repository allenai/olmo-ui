// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace error {
    export interface Details {
        code: number;
        message: string;
    }

    export interface Payload {
        error: Details;
    }

    export async function unpack(r: Response): Promise<Error> {
        switch (r.headers.get('content-type')) {
            // The API returns JSON errors with additional information.
            case 'application/json': {
                const err = (await r.json()) as Payload;
                return new Error(err.error.message);
            }
            // This is probably an error returned by the NGINX reverse proxy. Don't attempt to
            // parse the response. Use the HTTP status information.
            default:
                switch (r.status) {
                    // These both indicate that the backend API is unavailable for some reason.
                    // Show something that's a bit more user friendly than the HTTP status text.
                    case 502:
                    case 503:
                        return new Error(
                            'The API is currently unavailable. Please try again later.'
                        );
                    // We tell NGINX to return a 429 when a client surpasses a rate limit. Again
                    // show something more informative.
                    case 429:
                        return new Error(
                            "You've submitted too many requests recently. Please wait a few minutes and try again."
                        );
                    default:
                        return new Error(
                            `HTTP ${r.status}: ${
                                r.statusText !== '' ? r.statusText : 'Unknown error'
                            }`
                        );
                }
        }
    }
}
