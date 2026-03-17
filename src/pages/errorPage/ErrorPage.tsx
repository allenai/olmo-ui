import { useEffect, useRef } from 'react';
import { useRouteError } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { AuthErrorPage } from './AuthErrorPage';
import {
    HANDLED_STATUSES,
    hasStatus,
    hasStatusText,
    isHandledStatus,
    isLoginError,
    isMissingAuthorizationError,
} from './errorChecks';
import { GenericErrorPage } from './GenericErrorPage';

export const ErrorPage = () => {
    const error = useRouteError();
    const hasReportedErrorRef = useRef(false);

    useEffect(() => {
        // We can move this effect to RouterProvider.onError if we move to React Router v7
        if (!hasReportedErrorRef.current) {
            analyticsClient.trackError(error);

            hasReportedErrorRef.current = true;
        }
    });

    if (isMissingAuthorizationError(error)) {
        return (
            <AuthErrorPage
                title="You have been logged out due to inactivity"
                message="We will try to log you in automatically, otherwise click the login button"
            />
        );
    }

    if (isLoginError(error)) {
        return (
            <AuthErrorPage
                title={error.data.title}
                message={error.data.detail}
                redirectTo={error.data.redirectTo}
            />
        );
    }

    let statusMessage: string | undefined =
        'It’s not you, it’s us. If the page doesn’t load, try hitting refresh';

    if (hasStatus(error) && isHandledStatus(error.status)) {
        statusMessage = HANDLED_STATUSES[error.status];
    } else if (hasStatusText(error)) {
        // This is more specific than `error.message`
        statusMessage = error.statusText;
    }

    console.debug('ErrorPage', statusMessage, JSON.stringify(error));

    return <GenericErrorPage headline="Well this is embarrassing" statusMessage={statusMessage} />;
};
