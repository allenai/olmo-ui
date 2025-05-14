import { ComponentType } from 'react';

import { OlmoeLegalNotice } from './OlmoeLegalNotice';
import { TuluFamilyLegalNotice } from './TuluFamilyLegalNotice';

export const familySpecificLegalNoticesMap: Partial<Record<string, ComponentType>> = {
    tulu: TuluFamilyLegalNotice,
};

export const getModelSpecificLegalNotices = (modelId?: string) => {
    if (modelId !== undefined) {
        switch (modelId) {
            case 'olmoe-0125':
                return OlmoeLegalNotice;
        }
    }

    return null;
};
