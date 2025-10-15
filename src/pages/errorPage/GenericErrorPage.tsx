import { WarningAmberRounded } from '@mui/icons-material';
import { styled, Typography } from '@mui/material';

import { ErrorPageWrapper } from './ErrorPageWrapper';

const Warning = styled(WarningAmberRounded)(({ theme }) => ({
    fontSize: '4.5rem',
    display: 'block',
    marginInline: 'auto',
    marginBottom: theme.spacing(2),
    opacity: '0.3',
}));

interface GenericErrorPageProps {
    headline: string;
    statusMessage?: string;
}

export const GenericErrorPage = ({ headline, statusMessage }: GenericErrorPageProps) => {
    return (
        <ErrorPageWrapper>
            <Typography variant="h3" component="h1">
                <Warning />
                {headline}
            </Typography>
            {statusMessage ? <p>{statusMessage}</p> : null}
        </ErrorPageWrapper>
    );
};
