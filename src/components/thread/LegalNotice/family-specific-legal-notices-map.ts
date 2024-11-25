import { ComponentType } from 'react';

import { TuluFamilyLegalNotice } from './TuluFamilyLegalNotice';

export const familySpecificLegalNoticesMap: Record<string, ComponentType | undefined> = {
    tulu: TuluFamilyLegalNotice,
};
