import { LoginOutlined as LoginIcon } from '@mui/icons-material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Button, Stack, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { LOGIN_ERROR_TYPE, LoginError } from '@/api/auth/auth-loaders';
import { AppLayout } from '@/components/AppLayout';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

const hasStatusText = (error: unknown): error is { statusText: string } => {
    return 'statusText' in (error as object);
};
const hasStatus = (error: unknown): error is { status: number } => {
    return 'status' in (error as object);
};
const hasMessage = (error: unknown): error is { message: string } => {
    return 'message' in (error as object);
};
const hasStack = (error: unknown): error is { stack: string } => {
    return 'stack' in (error as object);
};

const isLoginError = (error: unknown): error is LoginError => {
    return (
        isRouteErrorResponse(error) &&
        typeof error.data === 'object' &&
        'type' in error.data &&
        // We check to make sure type exists right above, this is a safe access
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.data.type === LOGIN_ERROR_TYPE
    );
};

export const ErrorPage = () => {
    const error = useRouteError();

    let statusMessage;
    let statusText;
    let message;

    if (isLoginError(error)) {
        console.log(error);
        statusMessage =
            'Something went wrong when logging in. Please try again or try another page.';
        statusText = (
            <Button
                endIcon={<LoginIcon />}
                href={links.login(error.data.redirectTo)}
                variant="contained">
                Log in
            </Button>
        );
    } else {
        if (hasStatus(error)) {
            if (error.status === 404) {
                statusMessage = 'We cannot find that page';
            } else if (error.status === 401) {
                statusMessage = "You aren't authorized to see this";
            } else if (error.status === 503) {
                statusMessage = 'Looks like our API is down';
            }
        }

        if (hasStatusText(error)) {
            statusText = error.statusText;
        }

        if (hasMessage(error)) {
            message = error.message;
        }
    }

    console.log(statusMessage, statusText);

    return (
        <AppLayout>
            <Stack
                gap={2}
                gridArea="content"
                bgcolor="background.paper"
                paddingInline={{ xs: 2, [DESKTOP_LAYOUT_BREAKPOINT]: 0 }}>
                <Typography variant="h3" component="h1">
                    <SentimentVeryDissatisfiedIcon sx={{ fontSize: 150 }} />
                    <br />
                    Sorry, we have hit a snag
                </Typography>
                {statusMessage != null ? (
                    <Typography variant="h4" component="p">
                        {statusMessage}
                    </Typography>
                ) : null}
                {statusText != null ? (
                    <Typography variant="h4" component="p">
                        {statusText}
                    </Typography>
                ) : null}
                {message != null ? (
                    <Typography variant="h4" component="p">
                        {message}
                    </Typography>
                ) : null}
                {hasStack(error) ? <Typography>{error.stack}</Typography> : null}
            </Stack>
        </AppLayout>
    );
};
