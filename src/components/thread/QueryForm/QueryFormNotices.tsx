import { alpha, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';

import { familySpecificQueryFormNoticesMap } from './family-specific-query-form-notices-map';

export const QueryFormNotice = (): ReactNode => {
    const selectedModelFamilyId = useAppContext((state) => state.selectedModel?.family_id);

    const FamilySpecificFormNotice =
        selectedModelFamilyId != null
            ? familySpecificQueryFormNoticesMap[selectedModelFamilyId]
            : undefined;

    return (
        <Typography
            component="p"
            variant="caption"
            textAlign="center"
            sx={(theme) => ({
                display: 'block',
                fontSize: '0.7rem',
                lineHeight: '1.5',
                margin: '0',
                color: alpha(
                    theme.palette.text.primary,
                    theme.palette.mode === 'dark' ? 0.5 : 0.75
                ),
                paddingInline: 2,
            })}>
            Always fact-check your results.
            {FamilySpecificFormNotice != null && (
                <>
                    {' '}
                    <FamilySpecificFormNotice />
                </>
            )}
        </Typography>
    );
};
