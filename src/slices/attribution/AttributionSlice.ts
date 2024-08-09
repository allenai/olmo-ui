import { AttributionClient, Document } from '@/api/AttributionClient';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

export interface MessageWithAttributionDocuments {
    documents: Partial<Record<string, Document>>;
    loadingState: RemoteState | null;
}

interface AttributionState {
    attribution: {
        selectedDocumentIndex: string | null;
        previewDocumentIndex: string | null;
        documentsByMessageId: Partial<Record<string, MessageWithAttributionDocuments>>;
        selectedMessageId: string | null;
    };
}

interface AttributionActions {
    addDocument: (document: Document, messageId: string) => void;
    setSelectedDocument: (documentIndex: string) => void;
    setPreviewDocument: (previewDocumentIndex: string) => void;
    unsetPreviewDocument: (previewDocumentIndex: string) => void;
    resetAttribution: () => void;
    setSelectedMessage: (messageId: string) => void;
    getAttributionsForMessage: (messageId: string) => Promise<AttributionState>;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        selectedDocumentIndex: null,
        previewDocumentIndex: null,
        documentsByMessageId: {},
        selectedMessageId: null,
    },
};

const attributionClient = new AttributionClient();

export const createAttributionSlice: OlmoStateCreator<AttributionSlice> = (set, get) => ({
    ...initialAttributionState,

    addDocument: (document: Document, messageId: string) => {
        set(
            (state) => {
                if (state.attribution.documentsByMessageId[messageId] == null) {
                    state.attribution.documentsByMessageId[messageId] = {
                        loadingState: null,
                        documents: {
                            [document.index]: document,
                        },
                    };
                } else {
                    state.attribution.documentsByMessageId[messageId].documents[document.index] =
                        document;
                }
            },
            false,
            'attribution/addDocument'
        );
    },

    setSelectedDocument: (documentIndex: string) => {
        set(
            (state) => {
                state.attribution.selectedDocumentIndex = documentIndex;
            },
            false,
            'attribution/setSelectedDocument'
        );
    },

    setPreviewDocument: (previewDocumentIndex: string) => {
        set(
            (state) => {
                state.attribution.previewDocumentIndex = previewDocumentIndex;
            },
            false,
            'attribution/setPreviewDocument'
        );
    },

    unsetPreviewDocument: (previewDocumentIndex) => {
        set(
            (state) => {
                if (state.attribution.previewDocumentIndex === previewDocumentIndex) {
                    state.attribution.previewDocumentIndex = null;
                }
            },
            false,
            'attribution/unsetPreviewDocument'
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

    setSelectedMessage: (messageId: string) => {
        set(
            (state) => {
                state.attribution.selectedMessageId = messageId;
            },
            false,
            'attribution/setSelectedMessage'
        );
    },

    getAttributionsForMessage: async (messageId: string): Promise<AttributionState> => {
        const message = get().selectedThreadMessagesById[messageId];
        get().setSelectedMessage(messageId);

        const cachedMessages = get().attribution.documentsByMessageId[messageId]?.documents;

        if (cachedMessages == null || Object.keys(cachedMessages).length === 0) {
            set(
                (state) => {
                    if (state.attribution.documentsByMessageId[messageId] == null) {
                        state.attribution.documentsByMessageId[messageId] = {
                            documents: {},
                            loadingState: RemoteState.Loading,
                        };
                    } else {
                        state.attribution.documentsByMessageId[messageId].loadingState =
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
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        state.attribution.documentsByMessageId[messageId]!.loadingState =
                            RemoteState.Loaded;
                    },
                    false,
                    'attribution/finishGetAttributionsForMessage'
                );
            } catch {
                set(
                    (state) => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        state.attribution.documentsByMessageId[messageId]!.loadingState =
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
