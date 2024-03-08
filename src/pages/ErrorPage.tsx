import { useRouteError } from 'react-router-dom';
import { Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

import { MajorityScreen } from '../components/MajorityScreen';
import { StandardContainer } from '../components/StandardContainer';

export const ErrorPage = () => {
    const error = useRouteError();

    const hasStatusText = (error: any): error is { statusText: string } => {
        return 'statusText' in error;
    };
    const hasStatus = (error: any): error is { status: number } => {
        return 'status' in error;
    };
    const hasMessage = (error: any): error is { message: string } => {
        return 'message' in error;
    };
    const hasStack = (error: any): error is { stack: string } => {
        return 'stack' in error;
    };

    let statusMessage = '';
    if (hasStatus(error)) {
        if (error.status === 404) {
            statusMessage = "This page doesn't exist!";
        } else if (error.status === 401) {
            statusMessage = "You aren't authorized to see this";
        } else if (error.status === 503) {
            statusMessage = 'Looks like our API is down';
        }
    }

    return (
        <MajorityScreen>
            <StandardContainer>
                <Typography sx={{ m: 5 }} textAlign="center" variant="h3" component="h1">
                    <SentimentVeryDissatisfiedIcon sx={{ fontSize: 150 }} />
                    <br />
                    Sorry, we have hit a snag
                </Typography>
                {hasStatus(error) ? (
                    <Typography variant="h4" component="p">
                        {statusMessage}
                    </Typography>
                ) : null}
                {hasStatusText(error) ? (
                    <Typography variant="h4" component="p">
                        {error.statusText}
                    </Typography>
                ) : null}
                {hasMessage(error) ? (
                    <Typography variant="h4" component="p">
                        {error.message}
                    </Typography>
                ) : null}
                {hasStack(error) ? <Typography>{error.stack}</Typography> : null}
            </StandardContainer>
        </MajorityScreen>
    );
};
