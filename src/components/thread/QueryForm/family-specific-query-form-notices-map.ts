import { ComponentType } from 'react';

import { OlmoFamilyFormNotice } from './OlmoFamilyFormNotice';

export const familySpecificQueryFormNoticesMap: Partial<Record<string, ComponentType>> = {
    olmo: OlmoFamilyFormNotice,
};
