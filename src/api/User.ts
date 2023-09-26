export const WhoamiApiUrl = `${process.env.LLMX_API_URL}/v3/whoami`;
export const LoginApiUrl = `${process.env.LLMX_API_URL}/v3/login/skiff`;

export interface User {
    client: string;
}
