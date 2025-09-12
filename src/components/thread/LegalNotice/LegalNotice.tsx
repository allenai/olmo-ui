import { alpha, Theme, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';
import { useQueryContext } from '@/contexts/QueryContext';

import {
    familySpecificLegalNoticesMap,
    getModelSpecificLegalNotices,
} from './specific-legal-notices-map';

export const getLegalNoticeTextColor =
    (darkModeAlpha: number = 0.5) =>
    (theme: Theme) =>
        alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? darkModeAlpha : 0.75);

export const LegalNoticeTypography = ({ children }: PropsWithChildren) => {
    return (
        <Typography
            component="p"
            variant="caption"
            sx={{
                textWrap: 'pretty',
                fontSize: '0.7rem',
                lineHeight: '1.33',
                margin: '0',
                color: getLegalNoticeTextColor(),
            }}>
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
    const selectedModelFamilyId = selectedModel?.family_id;
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
