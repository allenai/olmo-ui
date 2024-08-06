import { AttributionClient, Document } from '@/api/AttributionClient';
import { OlmoStateCreator } from '@/AppContext';

interface AttributionState {
    attribution: {
        selectedDocumentIndex: string | null;
        previewDocumentIndex: string | null;
        documents: Record<string, Document>;
    };
}

interface AttributionActions {
    addDocument: (document: Document) => void;
    setSelectedDocument: (documentIndex: string) => void;
    resetAttribution: () => void;
    getAttributionsForMessage: (messageId: string) => Promise<AttributionState>;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        selectedDocumentIndex: null,
        previewDocumentIndex: null,
        documents: {},
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

    resetAttribution: () => {
        set(initialAttributionState, false, 'attribution/resetAttribution');
    },

    getAttributionsForMessage: async (messageId: string): Promise<AttributionState> => {
        const message = get().selectedThreadMessagesById[messageId];

        const attributionDocuments = await attributionClient.getAttributionDocuments(
            message.content,
            'olmo-7b-chat'
        );

        Object.values(attributionDocuments).forEach((document) => {
            get().addDocument(document);
        });

        return { attribution: get().attribution };
    },
});
