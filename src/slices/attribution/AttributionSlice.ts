import { Draft } from 'immer';

import { AttributionClient, Document, TopLevelAttributionSpan } from '@/api/AttributionClient';
import { type AppContextState, OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

export interface MessageWithAttributionDocuments {
    documents: { [documentIndex: string]: Document | undefined };
    spans: { [span: string]: TopLevelAttributionSpan | undefined };
    loadingState: RemoteState | null;
}

interface AttributionState {
    attribution: {
        selectedDocumentIndex: string | null;
        previewDocumentIndex: string | null;
        attributionsByMessageId: {
            [messageId: string]: MessageWithAttributionDocuments | undefined;
        };
        selectedMessageId: string | null;
        selectedSpanId: string | null;
    };
    orderedDocumentIds: number[];
    isAllHighlightVisible: boolean;
}

interface AttributionActions {
    selectDocument: (documentIndex: string) => void;
    previewDocument: (previewDocumentIndex: string) => void;
    stopPreviewingDocument: (previewDocumentIndex: string) => void;
    resetAttribution: () => void;
    selectMessage: (messageId: string) => void;
    getAttributionsForMessage: (messageId: string) => Promise<AttributionState>;
    selectSpan: (span: string) => void;
    resetSelectedSpan: () => void;
    toggleHighlightVisibility: () => void;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        selectedDocumentIndex: null,
        previewDocumentIndex: null,
        attributionsByMessageId: {},
        selectedMessageId: null,
        selectedSpanId: null,
    },
    isAllHighlightVisible: true,
    orderedDocumentIds: [],
};

const attributionClient = new AttributionClient();

const getAttributionsByMessageIdOrDefault = (state: Draft<AppContextState>, messageId: string) => {
    if (state.attribution.attributionsByMessageId[messageId] == null) {
        state.attribution.attributionsByMessageId[messageId] = {
            loadingState: null,
            documents: {},
            spans: {},
        };
    }

    return state.attribution.attributionsByMessageId[messageId];
};

export const createAttributionSlice: OlmoStateCreator<AttributionSlice> = (set, get) => ({
    ...initialAttributionState,

    selectDocument: (documentIndex: string) => {
        set(
            (state) => {
                state.attribution.selectedDocumentIndex = documentIndex;
            },
            false,
            'attribution/selectDocument'
        );
    },

    previewDocument: (previewDocumentIndex: string) => {
        set(
            (state) => {
                state.attribution.previewDocumentIndex = previewDocumentIndex;
            },
            false,
            'attribution/previewDocument'
        );
    },

    stopPreviewingDocument: (previewDocumentIndex: string) => {
        set(
            (state) => {
                if (state.attribution.previewDocumentIndex === previewDocumentIndex) {
                    state.attribution.previewDocumentIndex = null;
                }
            },
            false,
            'attribution/stopPreviewingDocument'
        );
    },

    resetAttribution: () => {
        set(
            (state) => {
                state.attribution.selectedMessageId = null;
                state.attribution.selectedSpanId = null;
            },
            false,
            'attribution/resetAttribution'
        );
    },

    selectMessage: (messageId: string) => {
        set(
            (state) => {
                state.attribution.selectedMessageId = messageId;
            },
            false,
            'attribution/selectMessage'
        );
    },

    getAttributionsForMessage: async (messageId: string): Promise<AttributionState> => {
        const message = get().selectedThreadMessagesById[messageId];
        get().selectMessage(messageId);

        const messageDocumentsLoadingState =
            get().attribution.attributionsByMessageId[messageId]?.loadingState;

        // If a request is in-flight or finished we don't need to fetch again
        if (
            messageDocumentsLoadingState !== RemoteState.Loading &&
            messageDocumentsLoadingState !== RemoteState.Loaded
        ) {
            set(
                (state) => {
                    const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                    attributions.loadingState = RemoteState.Loading;
                },
                false,
                'attribution/startGetAttributionsForMessage'
            );

            try {
                const attributionResponse = await attributionClient.getAttributionDocuments(
                    message.content,
                    'olmo-7b-chat'
                );

                set(
                    (state) => {
                        const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                        const orderedDocumentIds: number[] = attributionResponse.spans.flatMap(
                            (span) => [...span.documents]
                        );

                        attributionResponse.spans.forEach((span, index) => {
                            attributions.spans[index] = span;
                        });
                        attributionResponse.documents.forEach((document) => {
                            attributions.documents[document.index] = document;
                        });
                        state.orderedDocumentIds = orderedDocumentIds;
                        attributions.loadingState = RemoteState.Loaded;
                    },
                    false,
                    'attribution/finishGetAttributionsForMessage'
                );
            } catch {
                set(
                    (state) => {
                        const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                        attributions.loadingState = RemoteState.Error;
                    },
                    false,
                    'attribution/errorGetAttributionsForMessage'
                );
            }
        }

        return {
            attribution: get().attribution,
            isAllHighlightVisible: get().isAllHighlightVisible,
            orderedDocumentIds: get().orderedDocumentIds,
        };
    },

    selectSpan: (span: string) => {
        set(
            (state) => {
                state.attribution.selectedSpanId = span;
            },
            false,
            'attribution/selectSpan'
        );
    },

    resetSelectedSpan: () => {
        set(
            (state) => {
                state.attribution.selectedSpanId = null;
            },
            false,
            'attribution/resetSelectedSpan'
        );
    },

    toggleHighlightVisibility: () => {
        const { attribution, resetSelectedSpan } = get();
        if (attribution.selectedSpanId != null) {
            resetSelectedSpan();
        }
        set(
            (state) => {
                state.isAllHighlightVisible = !state.isAllHighlightVisible;
            },
            false,
            'attribution/toggleHighlightVisibility'
        );
    },
});
