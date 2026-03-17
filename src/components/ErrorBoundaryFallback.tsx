import { Alert, AlertTitle, styled } from '@mui/material';
import type { FC } from 'react';
import { type FallbackProps, getErrorMessage } from 'react-error-boundary';

const ErrorBoundaryDebugInfo = styled('code', {
    name: 'MuiErrorBoundary',
    slot: 'debugInfo',
})`
    display: block;
    padding: ${({ theme }) => theme.spacing(2)};
    margin: ${({ theme }) => theme.spacing(1.5)} 0 0;
    overflow: auto;
    pre {
        margin: 0;
        padding: 0;
        overflow: initial;
    }
`;

export const ErrorBoundaryFallback: FC<FallbackProps> = ({ error }) => {
    const showErrorDetails = process.env.NODE_ENV === 'development';
    const errorMessage = getErrorMessage(error) ?? 'Something went wrong';

    return (
        <Alert severity="error">
            <AlertTitle>Sorry, something went wrong.</AlertTitle>

            {showErrorDetails ? (
                <p>
                    <b>{errorMessage}:</b>
                    <ErrorBoundaryDebugInfo>
                        <pre>
                            {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                        </pre>
                    </ErrorBoundaryDebugInfo>
                </p>
            ) : (
                <div>Please try again.</div>
            )}
        </Alert>
    );
};
