import { ReactNode } from 'react';

import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';
import { links } from '@/Links';

export const OlmoeLegalNotice = (): ReactNode => {
    return (
        <>
            Run OlmoE locally and privately on your iOS device!{' '}
            <TermAndConditionsLink link={links.olmoeAppStoreDownload}>
                Download Ai2 OlmoE on the App Store
            </TermAndConditionsLink>{' '}
            to try it out.{' '}
        </>
    );
};
