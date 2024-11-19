import { Box, Typography } from '@mui/material';

interface NoResultsProps {
    request: string;
    resultsType?: string;
}

export const NoResults = ({ request, resultsType }: NoResultsProps) => (
    <Box sx={{ p: 4, borderRadius: '12px', backgroundColor: 'transparent' }}>
        <Typography
            variant="h6"
            sx={{ mt: 0, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Your Search - &quot;{request}&quot; - did not match any{' '}
            {resultsType ? resultsType + ' ' : ''}results.
        </Typography>
        <Typography variant="body1">Suggestions</Typography>
        <Typography component="ul" variant="body1">
            <Typography component="li" variant="body1">
                Check spelling of keywords.
            </Typography>
            <Typography component="li" variant="body1">
                Try different keywords.
            </Typography>
            <Typography component="li" variant="body1">
                Try more general keywords.
            </Typography>
        </Typography>
    </Box>
);
