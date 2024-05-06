import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Typography } from '@mui/material';

import { MajorityScreen } from '../components/MajorityScreen';
import { StandardContainer } from '../components/StandardContainer';

export const NotFound = () => {
    return (
        <MajorityScreen>
            <StandardContainer>
                <Typography sx={{ m: 5 }} textAlign="center" variant="h3" component="h1">
                    <SentimentVeryDissatisfiedIcon sx={{ fontSize: 150 }} />
                    <br />
                    Sorry, we cannot find that page
                </Typography>
            </StandardContainer>
        </MajorityScreen>
    );
};
