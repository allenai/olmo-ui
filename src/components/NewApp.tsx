import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useTrackPageView } from '@/analytics/useTrackPageView';

import { useAppContext } from '../AppContext';
import { AppLayout } from './AppLayout';

export const NewApp = () => {
    useTrackPageView();

    const userInfo = useAppContext((state) => state.userInfo);
    const getUserInfo = useAppContext((state) => state.getUserInfo);
    const schema = useAppContext((state) => state.schema);
    const getSchema = useAppContext((state) => state.getSchema);

    const [isLoading, setLoading] = useState(true);

    // TODO: There's an edge case where these XHR requests fail that we're not handling now.
    // This is a temporary compromise to avoid "flashing" an error to users while they're
    // being taken to the login page.
    useEffect(() => {
        setLoading(true);
        getUserInfo()
            .finally(() => {
                setLoading(false);
            })
            .catch((error: unknown) => {
                console.error('Failed to get user info');
                throw error;
            });
    }, [getSchema, getUserInfo]);

    const shouldShowTermsAndConditionsModal = userInfo?.hasAcceptedTermsAndConditions === false;

    return (
        <AppLayout shouldShowTermsAndConditionsModal={shouldShowTermsAndConditionsModal}>
            {!isLoading && userInfo && schema ? <Outlet /> : null}
        </AppLayout>
    );
};
