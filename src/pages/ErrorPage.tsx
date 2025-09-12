import { css } from '@allenai/varnish-panda-runtime/css';
import { LoginOutlined as LoginIcon, WarningAmberRounded } from '@mui/icons-material';
import { Button, styled, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { LOGIN_ERROR_TYPE, LoginError } from '@/api/auth/auth-loaders';
import { AppLayout } from '@/components/AppLayout';
import { useColorMode } from '@/components/ColorModeProvider';
import { links } from '@/Links';

const HANDLED_STATUSES = {
    404: 'We cannot find that page, if you typed the URL, check the spelling.',
    401: "You aren't authorized to see this page.",
    503: 'It’s not you, it’s us. Looks like our API is down.',
} as const;

const isHandledStatus = (status: number): status is keyof typeof HANDLED_STATUSES => {
    return status in HANDLED_STATUSES;
};
const hasStatus = (error: unknown): error is { status: number } => {
    return 'status' in (error as object);
};
const hasStatusText = (error: unknown): error is { statusText: string } => {
    return 'statusText' in (error as object);
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

const errorPageLayoutClassName = css({
    display: 'flex',
    gridArea: 'content',
    maxWidth: '[460px]',
    marginTop: '[32dvh]',
    marginInline: 'auto',
    flexDirection: 'column',
    textAlign: 'center',
    gap: '5',
    padding: '5',
    fontWeight: 'medium',
});

export const ErrorPage = () => {
    const error = useRouteError();
    const { colorMode } = useColorMode();
    const colorModeColor = colorMode === 'light' ? 'primary' : 'secondary';

    let statusMessage = 'It’s not you, it’s us. If the page doesn’t load, try hitting refresh.';
    let loginButton;

    if (hasStatus(error) && isHandledStatus(error.status)) {
        statusMessage = HANDLED_STATUSES[error.status];
    } else if (hasStatusText(error)) {
        // This is more specific than `error.message`
        statusMessage = error.statusText;
    }

    if (isLoginError(error)) {
        loginButton = (
            <Button
                endIcon={<LoginIcon />}
                href={links.login(error.data.redirectTo)}
                variant="contained"
                color={colorModeColor}>
                Log in
            </Button>
        );
    }

    // log complete error and message
    console.debug(statusMessage, error);

    return (
        <AppLayout>
            <div className={errorPageLayoutClassName}>
                <Typography variant="h3" component="h1">
                    <Warning />
                    Well this is embarrassing.
                </Typography>
                <p>{statusMessage}</p>
                {loginButton ? <p>{loginButton}</p> : null}
            </div>
        </AppLayout>
    );
};

const Warning = styled(WarningAmberRounded)(({ theme }) => ({
    fontSize: '4.5rem',
    display: 'block',
    marginInline: 'auto',
    marginBottom: theme.spacing(2),
    opacity: '0.3',
}));
