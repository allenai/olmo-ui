export const WhoamiApiUrl = `${process.env.LLMX_API_URL}/v3/whoami`;

/**
 * If the provided response was a 401 Unauthorized, navigate to a URL that will
 * prompt the user to authenticate.
 *
 * The Response is returned in the event that the response was not a 401. This
 * makes it convenient to use in a Promise chain.
 */
export function loginOn401(r: Response): Response {
    if (r.status === 401) {
        document.location.href = `${process.env.LLMX_API_URL}/v3/login/skiff`;
        // This shouldn't ever happen
        throw new Error('Unauthorized');
    }
    return r;
}

export interface User {
    client: string;
}
