import { AttributionClient, Document } from '@/api/AttributionClient';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

export interface MessageWithAttributionDocuments {
    documents: { [documentIndex: string]: Document | undefined };
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
    };
}

interface AttributionActions {
    addDocument: (document: Document, messageId: string) => void;
    selectDocument: (documentIndex: string) => void;
    previewDocument: (previewDocumentIndex: string) => void;
    stopPreviewingDocument: (previewDocumentIndex: string) => void;
    resetAttribution: () => void;
    selectMessage: (messageId: string) => void;
    getAttributionsForMessage: (messageId: string) => Promise<AttributionState>;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        selectedDocumentIndex: null,
        previewDocumentIndex: null,
        attributionsByMessageId: {},
        selectedMessageId: null,
    },
};

const attributionClient = new AttributionClient();

export const createAttributionSlice: OlmoStateCreator<AttributionSlice> = (set, get) => ({
    ...initialAttributionState,

    addDocument: (document: Document, messageId: string) => {
        set(
            (state) => {
                if (state.attribution.attributionsByMessageId[messageId] == null) {
                    state.attribution.attributionsByMessageId[messageId] = {
                        loadingState: null,
                        documents: {
                            [document.index]: document,
                        },
                    };
                } else {
                    state.attribution.attributionsByMessageId[messageId].documents[document.index] =
                        document;
                }
            },
            false,
            'attribution/addDocument'
        );
    },

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
                    if (state.attribution.attributionsByMessageId[messageId] == null) {
                        state.attribution.attributionsByMessageId[messageId] = {
                            documents: {},
                            loadingState: RemoteState.Loading,
                        };
                    } else {
                        state.attribution.attributionsByMessageId[messageId].loadingState =
                            RemoteState.Loading;
                    }
                },
                false,
                'attribution/startGetAttributionsForMessage'
            );

            try {
                const attributionDocuments = await attributionClient.getAttributionDocuments(
                    message.content,
                    'olmo-7b-chat'
                );

                Object.values(attributionDocuments).forEach((document) => {
                    get().addDocument(document, messageId);
                });

                set(
                    (state) => {
                        // Since we create the object above this _should_ be safe.
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        state.attribution.attributionsByMessageId[messageId]!.loadingState =
                            RemoteState.Loaded;
                    },
                    false,
                    'attribution/finishGetAttributionsForMessage'
                );
            } catch {
                set(
                    (state) => {
                        // Since we create the object above this _should_ be safe.
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        state.attribution.attributionsByMessageId[messageId]!.loadingState =
                            RemoteState.Error;
                    },
                    false,
                    'attribution/errorGetAttributionsForMessage'
                );
            }
        }

        return { attribution: get().attribution };
    },
});
