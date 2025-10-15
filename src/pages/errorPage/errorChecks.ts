import { isRouteErrorResponse } from 'react-router-dom';

import { LOGIN_ERROR_TYPE, LoginError } from '@/api/auth/auth-loaders';

export const HANDLED_STATUSES = {
    404: 'We cannot find that page, if you typed the URL, check the spelling.',
    401: "You aren't authorized to see this page.",
    503: 'It’s not you, it’s us. Looks like our API is down.',
} as const;

export const isHandledStatus = (status: number): status is keyof typeof HANDLED_STATUSES => {
    return status in HANDLED_STATUSES;
};
export const hasStatus = (error: unknown): error is { status: number } => {
    return 'status' in (error as object);
};
export const hasStatusText = (error: unknown): error is { statusText: string } => {
    return 'statusText' in (error as object);
};
type MissingAuthorizationError = {
    error: {
        code: 401;
        error: 'missing_authorization';
    };
};

export const isMissingAuthorizationError = (e: unknown): e is MissingAuthorizationError => {
    return (
        e != null &&
        typeof e === 'object' &&
        'error' in e &&
        e.error != null &&
        typeof e.error === 'object' &&
        'code' in e.error &&
        e.error.code === 401 &&
        'error' in e.error &&
        e.error.error === 'missing_authorization'
    );
};

export const isLoginError = (error: unknown): error is LoginError => {
    return (
        isRouteErrorResponse(error) &&
        typeof error.data === 'object' &&
        'type' in error.data &&
        // We check to make sure type exists right above, this is a safe access
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.data.type === LOGIN_ERROR_TYPE
    );
};
