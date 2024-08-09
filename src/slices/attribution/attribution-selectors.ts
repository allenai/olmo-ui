import type { AppContextState } from '@/AppContext';

import { MessageWithAttributionDocuments } from './AttributionSlice';

export const documentsForMessageSelector = (
    state: AppContextState
): MessageWithAttributionDocuments | undefined => {
    if (state.attribution.selectedMessageId != null) {
        return state.attribution.documentsByMessageId[state.attribution.selectedMessageId];
    }

    return undefined;
};
