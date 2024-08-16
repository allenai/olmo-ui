import { Document } from '@/api/AttributionClient';
import type { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

interface MessageAttributionsFromSelector {
    documents: Document[];
    loadingState: RemoteState | null;
}

export const messageAttributionDocumentsSelector = (
    state: AppContextState
): MessageAttributionsFromSelector => {
    const attributions = messageAttributionsSelector(state);

    if (state.attribution.selectedSpanId != null) {
        const selectedSpan = attributions?.spans[state.attribution.selectedSpanId];

        // flatmap allows us to skip elements in a map by returning an empty array
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#for_adding_and_removing_items_during_a_map
        const documents = selectedSpan?.documents.flatMap((documentIndex) => {
            const document = attributions?.documents[documentIndex];

            return document != null ? [document] : [];
        });

        return {
            documents: documents ?? [],
            loadingState: attributions?.loadingState ?? null,
        };
    }

    const documents = Object.values(attributions?.documents ?? {}).filter(
        (document) => document != null
    );

    return {
        documents,
        loadingState: attributions?.loadingState ?? null,
    };
};
