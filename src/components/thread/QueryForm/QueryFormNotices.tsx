import { Typography, useColorScheme } from '@mui/material';
import { ReactNode } from 'react';

import { familySpecificQueryFormNoticesMap } from './family-specific-query-form-notices-map';

export interface QueryFormNoticeProps {
    selectedModelFamilyId?: string | null;
}

export const QueryFormNotice = ({ selectedModelFamilyId }: QueryFormNoticeProps): ReactNode => {
    const FamilySpecificFormNotice =
        selectedModelFamilyId != null
            ? familySpecificQueryFormNoticesMap[selectedModelFamilyId]
            : undefined;
    const { mode, systemMode } = useColorScheme();
    const colorMode = mode === 'system' || !mode ? systemMode ?? 'dark' : mode;

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
                color: `rgba(${theme.vars.palette.text.primaryChannel} / ${colorMode === 'dark' ? 0.5 : 0.75})`,
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
