import { ComponentType } from 'react';

import { Molmo2FamilyFormNotice } from './Molmo2FamilyFormNotice';
import { OlmoFamilyFormNotice } from './OlmoFamilyFormNotice';

export const familySpecificQueryFormNoticesMap: Partial<Record<string, ComponentType>> = {
    olmo: OlmoFamilyFormNotice,
    'molmo-2': Molmo2FamilyFormNotice,
};
