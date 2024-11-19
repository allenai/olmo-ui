import { alpha, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';

export const LegalNotice = () => {
    const userInfo = useAppContext((state) => state.userInfo);

    return (
        <Typography
            component="p"
            variant="caption"
            sx={(theme) => ({
                fontSize: '0.7rem',
                lineHeight: '1.25',
                margin: '0',
                color: alpha(
                    theme.palette.text.primary,
                    theme.palette.mode === 'dark' ? 0.5 : 0.75
                ),
            })}>
            <>
                Ai2 Playground is a free scientific research and educational tool; always fact-check
                your results
            </>
            {!userInfo?.hasAcceptedTermsAndConditions ? (
                <>
                    By using Ai2 Playground, you agree to Ai2’s{' '}
                    <TermAndConditionsLink link="https://allenai.org/terms">
                        Terms of use
                    </TermAndConditionsLink>
                    ,{' '}
                    <TermAndConditionsLink link="https://allenai.org/privacy-policy">
                        Privacy policy
                    </TermAndConditionsLink>
                    , and{' '}
                    <TermAndConditionsLink link="https://allenai.org/responsible-use">
                        Responsible use guidelines
                    </TermAndConditionsLink>
                    .
                </>
            ) : null}
            <>
                Llama Tulu3 models were built with Llama subject to the Meta{' '}
                <TermAndConditionsLink link="https://www.llama.com/llama3_1/license/">
                    Llama 3.1 Community License Agreement
                </TermAndConditionsLink>
                .
            </>
        </Typography>
    );
};
