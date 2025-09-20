import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { analyticsClient } from './AnalyticsClient';

export const useTrackPageView = () => {
    const location = useLocation();

    useEffect(() => {
        analyticsClient.trackPageView(location.pathname);
    }, [location]);
};
