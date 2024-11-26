import { ComponentType } from 'react';

import { ModelFamilyId } from '@/api/Model';

import { TuluFamilyLegalNotice } from './TuluFamilyLegalNotice';

export const familySpecificLegalNoticesMap: Partial<Record<ModelFamilyId, ComponentType>> = {
    tulu: TuluFamilyLegalNotice,
};
