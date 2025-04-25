import type { AppContextState } from '@/AppContext';

import { MessageWithAttributionDocuments } from './AttributionSlice';

export const hasSelectedAttributionSelector = (
    state: AppContextState,
    type?: 'document' | 'span'
): boolean => {
    const selection = state.attribution.selection;
    if (type === 'span' && selection?.type === 'span' && selection.selectedSpanIds.length > 0)
        return true;

    if (type === 'document' && selection?.type === 'document') return true;

    if (type === undefined) {
        return selection != null;
    }

    return false;
};

export const attributionErrorSelector = (state: AppContextState) => {
    const { selectedMessageId, attributionsByMessageId } = state.attribution;
    if (selectedMessageId !== null) {
        const selectedMessageAttribution = attributionsByMessageId[selectedMessageId];

        return selectedMessageAttribution?.attributionRequestError;
    }
};

export const messageAttributionsSelector = (
    state: AppContextState
): MessageWithAttributionDocuments | undefined => {
    if (state.attribution.selectedMessageId != null) {
        return state.attribution.attributionsByMessageId[state.attribution.selectedMessageId];
    }

    return undefined;
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
