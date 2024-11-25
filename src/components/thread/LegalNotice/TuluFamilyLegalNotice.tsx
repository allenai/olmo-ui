import { ReactNode } from 'react';

import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';

export const TuluFamilyLegalNotice = (): ReactNode => {
    return (
        <>
            Llama Tulu3 models were built with Llama subject to the Meta{' '}
            <TermAndConditionsLink link="https://www.llama.com/llama3_1/license/">
                Llama 3.1 Community License Agreement
            </TermAndConditionsLink>
            .
        </>
    );
};
