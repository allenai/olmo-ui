import type { AppContextState } from '@/AppContext';
import { ATTRIBUTION_DRAWER_ID } from '@/components/thread/attribution/drawer/AttributionDrawer';

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
    state.attribution.selection?.type === 'span' &&
    state.attribution.selection.selectedSpanIds.length > 0;

export const hasAttributionSelectionSelector = (state: AppContextState): boolean =>
    state.attribution.selection != null;

export const shouldShowHighlightsSelector = (state: AppContextState): boolean =>
    state.currentOpenDrawer === ATTRIBUTION_DRAWER_ID;
