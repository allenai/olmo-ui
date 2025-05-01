import { links } from '@/Links';

export const createLoginRedirectURL = (urlToRedirectToAfterLogin: string) => {
    const searchParams = new URLSearchParams();
    const redirectPathname = new URL(urlToRedirectToAfterLogin).pathname;

    searchParams.set('from', redirectPathname);

    return links.login(redirectPathname);
};
