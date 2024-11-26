import { ComponentType } from 'react';

import { ModelFamilyId } from '@/api/Model';

import { OLMoFamilyFormNotice } from './OLMoFamilyFormNotice';

export const familySpecificQueryFormNoticesMap: Partial<Record<ModelFamilyId, ComponentType>> = {
    olmo: OLMoFamilyFormNotice,
};
