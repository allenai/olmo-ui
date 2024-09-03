import { Document } from '@/api/AttributionClient';
import type { AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import {
    hasSelectedSpansSelector,
    messageAttributionsSelector,
} from '@/slices/attribution/attribution-selectors';

interface MessageAttributionsFromSelector {
    documents: Document[];
    loadingState: RemoteState | null;
}

export const messageAttributionDocumentsSelector = (
    state: AppContextState
): MessageAttributionsFromSelector => {
    const attributions = messageAttributionsSelector(state);
    const hasSelectedSpan = hasSelectedSpansSelector(state);

    if (hasSelectedSpan) {
        const selectedSpans = state.attribution.selectedSpanIds.map(
            (spanId) => attributions?.spans[spanId]
        );

        // flatmap allows us to skip elements in a map by returning an empty array
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#for_adding_and_removing_items_during_a_map
        const documents = selectedSpans
            .flatMap((span) =>
                span?.documents.flatMap((documentIndex) => {
                    const document = attributions?.documents[documentIndex];

                    return document != null ? [document] : [];
                })
            )
            .filter((document) => document != null);

        return {
            documents,
            loadingState: attributions?.loadingState ?? null,
        };
    }

    const documents: Document[] = state.orderedDocumentIds
        .map((docId) => {
            return attributions?.documents[docId.toString()];
        })
        .filter((doc) => doc !== undefined);

    const filteredDocuments = Array.from(new Map(documents.map(doc => [doc.index, doc])).values());

    return {
        documents: filteredDocuments,
        loadingState: attributions?.loadingState ?? null,
    };
};
