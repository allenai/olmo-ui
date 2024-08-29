import type { AppContextState } from '@/AppContext';

import { MessageWithAttributionDocuments } from './AttributionSlice';

export const messageAttributionsSelector = (
    state: AppContextState
): MessageWithAttributionDocuments | undefined => {
    if (state.attribution.selectedMessageId != null) {
        return state.attribution.attributionsByMessageId[state.attribution.selectedMessageId];
    }

    return undefined;
};

export const hasSelectedSpansSelector = (state: AppContextState): boolean =>
    state.attribution.selectedSpanIds.length > 0;
