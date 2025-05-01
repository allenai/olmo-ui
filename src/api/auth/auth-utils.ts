import { links } from '@/Links';

export const createLoginRedirectURL = (urlToRedirectToAfterLogin: string) => {
    const searchParams = new URLSearchParams();
    const redirectPathname = new URL(urlToRedirectToAfterLogin).pathname;

    searchParams.set('from', redirectPathname);

    return links.login(redirectPathname);
};

// https://stackoverflow.com/a/38552302
export const decodeToken = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload) as unknown;
};
