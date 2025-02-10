import { ComponentType } from 'react';

import { ModelFamilyId } from '@/api/Model';

import { OlmoELegalNotice } from './OlmoELegalNotice';
import { TuluFamilyLegalNotice } from './TuluFamilyLegalNotice';

export const familySpecificLegalNoticesMap: Partial<Record<ModelFamilyId, ComponentType>> = {
    tulu: TuluFamilyLegalNotice,
};

export const getModelSpecificLegalNotices = (modelId: string) => {
    switch (modelId) {
        case 'olmoe-0125':
            return OlmoELegalNotice;
    }

    return null;
};
