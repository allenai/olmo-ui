import { useEffectOnce } from '@/utils/useEffectOnce';

export type TagManagerConsentType =
    | 'ad_storage'
    | 'ad_user_data'
    | 'ad_personalization'
    | 'analytics_storage'
    | 'functionality_storage'
    | 'personalization_storage'
    | 'security_storage';

function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
}

const GOOGLE_CONSENT_KEY = 'google_consent';

export const useGTMConsent = () => {
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
        localStorage.setItem(GOOGLE_CONSENT_KEY, JSON.stringify(mappedConsent));

        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID}`;

        document.head.insertBefore(gtmScript, document.head.childNodes[0]);
    };

    return { setGTMConsent };
};
