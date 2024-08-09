import { AttributionClient, Document } from '@/api/AttributionClient';
import { OlmoStateCreator } from '@/AppContext';
import { type AppContextState } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

export const documentsForMessageSelector = (state: AppContextState) => {
    if (state.attribution.selectedMessageId != null) {
        return state.attribution.documentsByMessageId[state.attribution.selectedMessageId] ?? {};
    }

    return {};
};

interface AttributionState {
    attribution: {
        selectedDocumentIndex: string | null;
        previewDocumentIndex: string | null;
        documentsByMessageId: Record<string, Record<string, Document | undefined> | undefined>;
        loadingState: RemoteState | null;
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
        loadingState: null,
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
                        [document.index]: document,
                    };
                } else {
                    state.attribution.documentsByMessageId[messageId][document.index] = document;
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
        set(
            (state) => {
                state.attribution.loadingState = RemoteState.Loading;
            },
            false,
            'attribution/startGetAttributionsForMessage'
        );

        const message = get().selectedThreadMessagesById[messageId];
        get().setSelectedMessage(messageId);

        const cachedMessages = get().attribution.documentsByMessageId[messageId];

        if (cachedMessages == null || Object.keys(cachedMessages).length === 0) {
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
                        state.attribution.loadingState = RemoteState.Loaded;
                    },
                    false,
                    'attribution/finishGetAttributionsForMessage'
                );
            } catch {
                set(
                    (state) => (state.attribution.loadingState = RemoteState.Error),
                    false,
                    'attribution/errorGetAttributionsForMessage'
                );
            }
        }

        return { attribution: get().attribution };
    },
});
