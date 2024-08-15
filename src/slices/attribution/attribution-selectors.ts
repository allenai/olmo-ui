import { Document } from '@/api/AttributionClient';
import type { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

interface MessageAttributionsFromSelector {
    documents: (Document | undefined)[];
    loadingState: RemoteState | null;
}

export const messageAttributionsSelector = (
    state: AppContextState
): MessageAttributionsFromSelector => {
    if (state.attribution.selectedMessageId != null) {
        const attributions =
            state.attribution.attributionsByMessageId[state.attribution.selectedMessageId];

        if (state.attribution.selectedSpanId != null) {
            const selectedSpan = attributions?.spans[state.attribution.selectedSpanId];

            const documents =
                selectedSpan?.documents
                    .map((documentIndex) => attributions?.documents[documentIndex])
                    .filter(Boolean) ?? [];

            return {
                documents,
                loadingState: attributions?.loadingState ?? null,
            };
        }

        return {
            documents: Object.values(attributions?.documents ?? {}),
            loadingState: attributions?.loadingState ?? null,
        };
    }

    return {
        documents: [],
        loadingState: null,
    };
};
