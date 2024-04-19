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
                const err: Payload = (await r.json()) as Payload;
                return new Error(err.error.message);
            }
            // This is probably an error returned by the NGINX reverse proxy. Don't attempt to
            // parse the response. Use the HTTP status information.
            default:
                return new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
    }
}
