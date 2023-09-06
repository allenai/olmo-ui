export const WhoamiApiUrl = `${process.env.LLMX_API_URL}/v2/whoami`;

export interface User {
    client: string;
    token: string;
    created: string;
    expires: string;
}
