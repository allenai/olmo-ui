import { Typography } from '@mui/material';

import { WordDist } from './dolma/WordDist';
import { ResponsiveCard } from './ResponsiveCard';

export const DocumentLengthWrapper = () => {
    return (
        <ResponsiveCard>
            <Typography variant="h3">Document Length</Typography>
            <WordDist />
        </ResponsiveCard>
    );
};
