import '../osano.css';
import '@allenai/varnish-theme/tokens.css';
import '@/styled-system/styles.css';

import { Outlet } from 'react-router-dom';

import { Analytics } from '@/analytics/Analytics';
import { useTrackPageView } from '@/analytics/useTrackPageView';
import { useUserAuthInfo } from '@/api/auth/auth-loaders';

import { AppLayout } from './AppLayout';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';

export const NewApp = () => {
    useTrackPageView();

    const userAuthInfo = useUserAuthInfo();

    const shouldShowTermsAndConditionsModal =
        userAuthInfo.userInfo?.hasAcceptedTermsAndConditions === false;

    return (
        <AppLayout>
            {process.env.IS_ANALYTICS_ENABLED === 'true' && <Analytics />}
            {shouldShowTermsAndConditionsModal && (
                <TermsAndConditionsModal
                    initialTermsAndConditionsValue={false}
                    initialDataCollectionValue={''}
                />
            )}
            <Outlet />
        </AppLayout>
    );
};
