import { AttributionClient, Document } from '@/api/AttributionClient';
import { OlmoStateCreator } from '@/AppContext';

interface AttributionState {
    attribution: {
        selectedDocumentIndex?: string;
        documents: Record<string, Document>;
    };
}

interface AttributionActions {
    addDocument: (document: Document) => void;
    setSelectedDocument: (documentIndex: string) => void;
    resetAttribution: () => void;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        selectedDocumentIndex: undefined,
        documents: {},
    },
};

const attributionClient = new AttributionClient();

export const createAttributionSlice: OlmoStateCreator<AttributionSlice> = (set, get) => ({
    ...initialAttributionState,

    addDocument: (document: Document) => {
        set((state) => {
            state.attribution.documents[document.index] = document;
        });
    },

    setSelectedDocument: (documentIndex: string) => {
        set((state) => {
            state.attribution.selectedDocumentIndex = documentIndex;
        });
    },

    resetAttribution: () => {
        set(initialAttributionState);
    },

    getAttributionsForMessage: async (messageId: string) => {
        const message = get().selectedThreadMessagesById[messageId];

        const attributionDocuments = await attributionClient.getAttributionDocuments(
            message.content,
            'olmo-7b-chat'
        );

        Object.values(attributionDocuments).forEach((document) => {
            get().addDocument(document);
        });
    },
});
