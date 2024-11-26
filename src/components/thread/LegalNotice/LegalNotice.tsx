import { alpha, Theme, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { useAppContext } from '@/AppContext';
import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';

import { familySpecificLegalNoticesMap } from './family-specific-legal-notices-map';

export const getLegalNoticeTextColor = (theme: Theme) =>
    alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.5 : 0.75);

export const LegalNoticeTypography = ({ children }: PropsWithChildren) => {
    return (
        <Typography
            component="p"
            variant="caption"
            sx={{
                fontSize: '0.7rem',
                lineHeight: '1.25',
                margin: '0',
                color: getLegalNoticeTextColor,
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
    const selectedModelFamilyId = useAppContext((state) => state.selectedModel?.family_id);

    const FamilySpecificLegalNotice =
        selectedModelFamilyId != null
            ? familySpecificLegalNoticesMap[selectedModelFamilyId]
            : undefined;

    return (
        <LegalNoticeTypography>
            Ai2 Playground is a free scientific research and educational tool. By using Ai2
            Playground, you agree to Ai2’s{' '}
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
