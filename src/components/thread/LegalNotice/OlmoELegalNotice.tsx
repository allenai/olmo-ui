import { ReactNode } from 'react';

import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';

export const OlmoELegalNotice = (): ReactNode => {
    return (
        <>
            Run OLMoE locally and privately on your iOS device!{' '}
            <TermAndConditionsLink link="https://apps.apple.com/app/id6738533815">
                Download Ai2 OLMoE on the App Store
            </TermAndConditionsLink>{' '}
            to try it out.{' '}
        </>
    );
};
