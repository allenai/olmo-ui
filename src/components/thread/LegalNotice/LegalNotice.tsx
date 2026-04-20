import { Theme, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';
import { useQueryContext } from '@/contexts/QueryContext';

import {
    familySpecificLegalNoticesMap,
    getModelSpecificLegalNotices,
} from './specific-legal-notices-map';

// Returns an sx-compatible (theme) => string using CSS variables so color resolves per scheme.
export const getLegalNoticeTextColor =
    (opacity: number = 0.75) =>
    (theme: Theme): string =>
        `color-mix(in srgb, ${theme.vars.palette.text.primary} ${Math.round(opacity * 100)}%, transparent)`;

export const LegalNoticeTypography = ({ children }: PropsWithChildren) => {
    return (
        <Typography
            component="p"
            variant="caption"
            sx={(theme) => ({
                textWrap: 'pretty',
                fontSize: '0.7rem',
                lineHeight: '1.33',
                margin: '0',
                color: getLegalNoticeTextColor()(theme),
            })}>
            {children}
        </Typography>
    );
};

export const SmallLegalNotice = () => {
    return (
        <LegalNoticeTypography>
            Ai2 Playground is a free scientific research and educational tool; always fact-check
            your results.
        </LegalNoticeTypography>
    );
};

export const LegalNotice = () => {
    const queryContext = useQueryContext();

    const selectedModel = queryContext.getThreadViewModel();
    const selectedModelFamilyId = selectedModel?.familyId;
    const selectedModelId = selectedModel?.id;

    const FamilySpecificLegalNotice =
        selectedModelFamilyId != null
            ? familySpecificLegalNoticesMap[selectedModelFamilyId]
            : undefined;

    const ModelSpecificLegalNotice = getModelSpecificLegalNotices(selectedModelId);

    return (
        <LegalNoticeTypography>
            {ModelSpecificLegalNotice && <ModelSpecificLegalNotice />}
            Ai2 Playground is a free scientific and educational tool and by using it you agree to
            Ai2&rsquo;s{' '}
            <TermAndConditionsLink link="https://allenai.org/terms">
                Terms of use
            </TermAndConditionsLink>
            , and{' '}
            <TermAndConditionsLink link="https://allenai.org/responsible-use">
                Responsible Use Guidelines
            </TermAndConditionsLink>
            , and have read Ai2&rsquo;s{' '}
            <TermAndConditionsLink link="https://allenai.org/privacy-policy">
                Privacy policy
            </TermAndConditionsLink>
            . This site is protected by reCAPTCHA and the Google{' '}
            <TermAndConditionsLink link="https://policies.google.com/privacy">
                Privacy Policy
            </TermAndConditionsLink>{' '}
            and{' '}
            <TermAndConditionsLink link="https://policies.google.com/terms">
                Terms of Service
            </TermAndConditionsLink>{' '}
            apply.
            {FamilySpecificLegalNotice != null && (
                <>
                    {' '}
                    <FamilySpecificLegalNotice />
                </>
            )}
        </LegalNoticeTypography>
    );
};
