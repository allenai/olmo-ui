import { MajorityScreen } from '../components/MajorityScreen';
import { NewQuery } from '../components/NewQuery';
import { RecentQueries } from '../components/RecentQueries';

export const Home = () => {
    return (
        <MajorityScreen>
            <NewQuery />
            <RecentQueries />
        </MajorityScreen>
    );
};
