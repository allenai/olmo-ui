import { useShallow } from 'zustand/react/shallow';

import { Document as AttributionDocument } from '@/api/AttributionClient';
import { type AppContextState, useAppContext } from '@/AppContext';
import {
    hasSelectedAttributionSelector,
    messageAttributionsSelector,
} from '@/slices/attribution/attribution-selectors';
import { SpansSelection } from '@/slices/attribution/AttributionSlice';

export const messageAttributionDocumentsSelector = (
    state: AppContextState
): AttributionDocument[] => {
    const attributions = messageAttributionsSelector(state);
    const hasSelectedSpan = hasSelectedAttributionSelector(state, 'span');

    if (hasSelectedSpan) {
        // TODO: See if there's a better way to handle the typing here. We know we're in a "spans" selection mode because of hasSelectedSpan
        const selectedSpans = (state.attribution.selection as SpansSelection).selectedSpanIds.map(
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

        return documents;
    }

    const documents: AttributionDocument[] = (attributions?.orderedDocumentIndexes ?? [])
        .map((docId) => {
            return attributions?.documents[docId.toString()];
        })
        .filter((doc) => doc !== undefined);

    const filteredDocuments = Array.from(
        new Map(documents.map((doc) => [doc.index, doc])).values()
    );

    return filteredDocuments;
};

export const useAttributionDocumentsForMessage = () => {
    const attributionDocuments = useAppContext(useShallow(messageAttributionDocumentsSelector));

    return attributionDocuments;
};
