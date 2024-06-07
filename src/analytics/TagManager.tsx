import { useEffectOnce } from '@/utils/useEffectOnce';

export type TagManagerConsentType =
    | 'ad_storage'
    | 'ad_user_data'
    | 'ad_personalization'
    | 'analytics_storage'
    | 'functionality_storage'
    | 'personalization_storage'
    | 'security_storage';

export const useGTMConsent = () => {
    function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
    }
    useEffectOnce(() => {
        // adapted from https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
        window.dataLayer = window.dataLayer ?? [];

        gtag('consent', 'default', {
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            ad_storage: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
        });

        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    });

    const setGTMConsent = (consent: Record<TagManagerConsentType, boolean>) => {
        const mappedConsent = Object.entries(consent).reduce<Record<string, string>>(
            (acc, [consentType, isEnabled]) => {
                acc[consentType] = isEnabled ? 'granted' : 'denied';
                return acc;
            },
            {}
        );

        gtag('consent', 'update', mappedConsent);
    };

    return { setGTMConsent };
};
