import '../osano.css';
import '@allenai/varnish-theme/tokens.css';
import '@/styled-system/styles.css';

import { Outlet } from 'react-router-dom';

import { Analytics } from '@/analytics/Analytics';
import { useTrackPageView } from '@/analytics/useTrackPageView';
import { useUserAuthInfo } from '@/api/auth/auth-loaders';

import { AppLayout } from './AppLayout';
import { TermsAndDataCollectionModal } from './TermsAndDataCollectionModal';

export const NewApp = () => {
    useTrackPageView();

    const userAuthInfo = useUserAuthInfo();

    const shouldShowTermsAndConditionsModal =
        userAuthInfo.userInfo?.hasAcceptedTermsAndConditions === false;

    return (
        <AppLayout>
            {process.env.VITE_IS_ANALYTICS_ENABLED === 'true' && <Analytics />}
            {shouldShowTermsAndConditionsModal && (
                <TermsAndDataCollectionModal
                    initialTermsAndConditionsValue={
                        userAuthInfo.userInfo?.hasAcceptedTermsAndConditions
                    }
                    initialDataCollectionValue={userAuthInfo.userInfo?.hasAcceptedDataCollection}
                />
            )}
            <Outlet />
        </AppLayout>
    );
};
