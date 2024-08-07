import { AttributionClient, Document } from '@/api/AttributionClient';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

interface AttributionState {
    attribution: {
        selectedDocumentIndex: string | null;
        previewDocumentIndex: string | null;
        documents: Record<string, Document>;
        loadingState: RemoteState | null;
    };
}

interface AttributionActions {
    addDocument: (document: Document) => void;
    setSelectedDocument: (documentIndex: string) => void;
    setPreviewDocument: (previewDocumentIndex: string) => void;
    unsetPreviewDocument: (previewDocumentIndex: string) => void;
    resetAttribution: () => void;
    getAttributionsForMessage: (messageId: string) => Promise<AttributionState>;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        selectedDocumentIndex: null,
        previewDocumentIndex: null,
        documents: {},
        loadingState: null,
    },
};

const attributionClient = new AttributionClient();

export const createAttributionSlice: OlmoStateCreator<AttributionSlice> = (set, get) => ({
    ...initialAttributionState,

    addDocument: (document: Document) => {
        set(
            (state) => {
                state.attribution.documents[document.index] = document;
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
        set(initialAttributionState, false, 'attribution/resetAttribution');
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

        try {
            const attributionDocuments = await attributionClient.getAttributionDocuments(
                message.content,
                'olmo-7b-chat'
            );

            Object.values(attributionDocuments).forEach((document) => {
                get().addDocument(document);
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

        return { attribution: get().attribution };
    },
});
