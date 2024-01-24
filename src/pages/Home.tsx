import React from 'react';

import { MajorityScreen } from '../components/MajorityScreen';
import { NewQuery } from '../components/NewQuery';
import { RecentQueries } from '../components/RecentQueries';
import { RepromptActionContextProvider } from '../contexts/repromptActionContext';

export const Home = () => {
    return (
        <MajorityScreen>
            <RepromptActionContextProvider>
                <NewQuery />
                <RecentQueries />
            </RepromptActionContextProvider>
        </MajorityScreen>
    );
};
