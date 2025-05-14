import { ComponentType } from 'react';

import { OLMoFamilyFormNotice } from './OLMoFamilyFormNotice';

export const familySpecificQueryFormNoticesMap: Partial<Record<string, ComponentType>> = {
    olmo: OLMoFamilyFormNotice,
};
