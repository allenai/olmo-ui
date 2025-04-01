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
    state.attribution.selection?.type === 'span' &&
    state.attribution.selection.selectedSpanIds.length > 0;

export const hasAttributionSelectionSelector = (state: AppContextState): boolean =>
    state.attribution.selection != null;

export const attributionErrorSelector = (state: AppContextState) => {
    const { selectedMessageId, attributionsByMessageId } = state.attribution;
    if (selectedMessageId !== null) {
        const selectedMessageAttribution = attributionsByMessageId[selectedMessageId];

        return selectedMessageAttribution?.attributionRequestError;
    }
};

export const messageLengthSelector = (state: AppContextState): number => {
    if (state.attribution.selectedMessageId != null) {
        return (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.attribution.selectedMessageId]?.content.length ||
            0
        );
    }
    return 0;
};
