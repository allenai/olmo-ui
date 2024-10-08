import { Document, TopLevelAttributionSpan } from '@/api/AttributionClient';
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
        const selectedSpans = state.attribution.selectedSpanIds.reduce<TopLevelAttributionSpan[]>(
            (accu, spanId) => {
                const span = attributions?.spans[spanId];
                if (span) {
                    accu.push(span);
                }
                return accu;
            },
            []
        );

        // flatmap allows us to skip elements in a map by returning an empty array
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#for_adding_and_removing_items_during_a_map
        const documents = selectedSpans.flatMap((span) =>
            span.documents.flatMap((documentIndex) => {
                return attributions?.documents[documentIndex] || [];
            })
        );

        return {
            documents,
            loadingState: attributions?.loadingState ?? null,
        };
    }

    const documents = [...new Set(state.orderedDocumentIds)].reduce<Document[]>((accu, docId) => {
        const docs = attributions?.documents[docId.toString()];
        return docs ? accu.concat(docs) : accu;
    }, []);

    return {
        documents,
        loadingState: attributions?.loadingState ?? null,
    };
};
