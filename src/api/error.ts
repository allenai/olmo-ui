// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace error {
    export interface Details {
        code: number;
        message: string;
    }

    export interface ValidationErrorPayload {
        input: string;
        loc: string[];
        msg: string;
        type: string;
        url: string;
    }

    export interface ValidationErrorDetails extends Details {
        validation_errors: ValidationErrorPayload[];
    }

    // adapted from https://github.com/sindresorhus/ky/blob/main/source/errors/HTTPError.ts
    export class HTTPError extends Error {
        public response: Response;
        public status: number | null;
        public title: string;

        constructor(message: string, response: Response) {
            super(message);

            this.name = 'HTTPError';
            this.response = response;
            this.status = response.status || response.status === 0 ? response.status : null;
            this.title = response.statusText || '';
        }
    }
    export class ValidationError extends Error {
        constructor(
            public message: string,
            public validationErrors: ValidationErrorPayload[]
        ) {
            super(message);
            this.name = 'ValidationError';
        }
    }

    function isValidationErrorPayload(error: object): error is ValidationErrorDetails {
        return 'validation_errors' in (error as ValidationErrorDetails);
    }

    export interface Payload {
        error: Details | ValidationErrorDetails;
    }

    export async function unpack(r: Response): Promise<Error> {
        switch (r.headers.get('content-type')) {
            // The API returns JSON errors with additional information.
            case 'application/json': {
                const err: Payload = (await r.json()) as Payload;

                if (isValidationErrorPayload(err.error)) {
                    return new ValidationError(err.error.message, err.error.validation_errors);
                }
                return new HTTPError(err.error.message, r);
            }
            // This is probably an error returned by the NGINX reverse proxy. Don't attempt to
            // parse the response. Use the HTTP status information.
            default:
                return new HTTPError(`HTTP ${r.status}: ${r.statusText}`, r);
        }
    }
}
