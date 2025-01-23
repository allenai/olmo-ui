import { Draft } from 'immer';

import { AttributionClient, Document, TopLevelAttributionSpan } from '@/api/AttributionClient';
import { error } from '@/api/error';
import { Role } from '@/api/Role';
import { type AppContextState, OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

export interface MessageWithAttributionDocuments {
    orderedDocumentIndexes: string[];
    documents: { [documentIndex: string]: Document | undefined };
    spans: { [span: string]: TopLevelAttributionSpan | undefined };
    loadingState: RemoteState | null;
    index: string | null;
    isModelSupported?: boolean;
}

export interface DocumentSelection {
    type: 'document';
    documentIndex: string;
}

export interface SpansSelection {
    type: 'span';
    // Currently the only way of selecting multiple spans is from a code block with multiple spans in it. It will select all the spans inside of it when the select button is pressed.
    selectedSpanIds: string[];
}

interface AttributionState {
    attribution: {
        selection: DocumentSelection | SpansSelection | null;
        attributionsByMessageId: {
            [messageId: string]: MessageWithAttributionDocuments | undefined;
        };
        selectedMessageId: string | null;
        selectedRepeatedDocumentIndex: string | null;
    };
}

interface AttributionActions {
    selectDocument: (documentIndex: string) => void;
    resetAttribution: () => void;
    selectMessage: (messageId: string) => void;
    unselectMessage: (messageId: string) => void;
    getAttributionsForMessage: (prompt: string, messageId: string) => Promise<AttributionState>;
    selectSpans: (span: string | string[]) => void;
    resetCorpusLinkSelection: () => void;
    handleAttributionForChangingThread: () => void;
    selectRepeatedDocument: (documentIndex: string) => void;
    resetSelectedRepeatedDocument: () => void;
    isAttributionAvailable: () => boolean;
}

export type AttributionSlice = AttributionState & AttributionActions;

const initialAttributionState: AttributionState = {
    attribution: {
        attributionsByMessageId: {},
        selection: null,
        selectedMessageId: null,
        selectedRepeatedDocumentIndex: null,
    },
};

const attributionClient = new AttributionClient();

const getAttributionsByMessageIdOrDefault = (state: Draft<AppContextState>, messageId: string) => {
    if (state.attribution.attributionsByMessageId[messageId] == null) {
        state.attribution.attributionsByMessageId[messageId] = {
            loadingState: null,
            orderedDocumentIndexes: [],
            documents: {},
            spans: {},
            index: null,
        };
    }

    return state.attribution.attributionsByMessageId[messageId];
};

export const createAttributionSlice: OlmoStateCreator<AttributionSlice> = (set, get) => ({
    ...initialAttributionState,

    selectDocument: (documentIndex: string) => {
        set(
            (state) => {
                state.attribution.selection = { type: 'document', documentIndex };
            },
            false,
            'attribution/selectDocument'
        );
    },

    resetAttribution: () => {
        set(
            (state) => {
                state.attribution.selectedMessageId = null;
                state.attribution.selection = initialAttributionState.attribution.selection;
                state.attribution.selectedRepeatedDocumentIndex =
                    initialAttributionState.attribution.selectedRepeatedDocumentIndex;
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

        const selectedThreadMessagesById = get().selectedThreadMessagesById;
        const message = selectedThreadMessagesById[messageId];
        let prompt = '';
        if (message.role === Role.LLM) {
            const parentId = selectedThreadMessagesById[messageId].parent;
            if (parentId != null) {
                prompt = selectedThreadMessagesById[parentId].content;
            }
        }

        get()
            .getAttributionsForMessage(prompt, messageId)
            .catch((error: unknown) => {
                throw error;
            });
    },

    unselectMessage: (messageId: string) => {
        set((state) => {
            if (state.attribution.selectedMessageId === messageId) {
                state.attribution.selectedMessageId = null;
            }
        });
    },

    getAttributionsForMessage: async (
        prompt: string,
        messageId: string
    ): Promise<AttributionState> => {
        const message = get().selectedThreadMessagesById[messageId];

        const messageDocumentsLoadingState =
            get().attribution.attributionsByMessageId[messageId]?.loadingState;

        // If a request is in-flight or finished we don't need to fetch again
        if (
            message.model_id &&
            messageDocumentsLoadingState !== RemoteState.Loading &&
            messageDocumentsLoadingState !== RemoteState.Loaded
        ) {
            set(
                (state) => {
                    const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                    attributions.loadingState = RemoteState.Loading;
                    attributions.isModelSupported = undefined;
                },
                false,
                'attribution/startGetAttributionsForMessage'
            );

            try {
                const attributionResponse = await attributionClient.getAttributionDocuments(
                    prompt,
                    message.content,
                    message.model_id
                );

                set(
                    (state) => {
                        const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                        attributions.index = attributionResponse.index;

                        attributionResponse.spans.forEach((span, index) => {
                            attributions.spans[index] = span;
                        });

                        attributionResponse.documents.forEach((document) => {
                            attributions.documents[document.index] = document;
                        });

                        attributions.orderedDocumentIndexes = attributionResponse.documents.map(
                            (document) => document.index
                        );

                        attributions.loadingState = RemoteState.Loaded;
                        attributions.isModelSupported = true;
                    },
                    false,
                    'attribution/finishGetAttributionsForMessage'
                );
            } catch (e) {
                set(
                    (state) => {
                        const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                        attributions.loadingState = RemoteState.Error;
                        if (
                            e instanceof error.ValidationError &&
                            e.validationErrors.some((validationError) =>
                                validationError.loc.some((loc) => loc === 'model_id')
                            )
                        ) {
                            attributions.isModelSupported = false;
                        }
                    },
                    false,
                    'attribution/errorGetAttributionsForMessage'
                );
            }
        }

        return {
            attribution: get().attribution,
        };
    },

    selectSpans: (spanIds: string | string[]) => {
        set(
            (state) => {
                state.attribution.selection = {
                    type: 'span',
                    selectedSpanIds: Array.isArray(spanIds) ? spanIds : [spanIds],
                };
            },
            false,
            'attribution/selectSpan'
        );
    },

    resetCorpusLinkSelection: () => {
        set(
            (state) => {
                state.attribution.selection = null;
            },
            false,
            'attribution/resetCorpusLinkSelection'
        );
    },

    selectRepeatedDocument: (documentIndex: string) => {
        set(
            (state) => {
                state.attribution.selectedRepeatedDocumentIndex = documentIndex;
            },
            false,
            'attribution/selectRepeatedDocument'
        );
    },

    resetSelectedRepeatedDocument: () => {
        set(
            (state) => {
                state.attribution.selectedRepeatedDocumentIndex =
                    initialAttributionState.attribution.selectedRepeatedDocumentIndex;
            },
            false,
            'attribution/resetSelectedRepeatedDocument'
        );
    },

    handleAttributionForChangingThread: () => {
        // when we change threads we want to reset all the selected spans from the last thread
        get().resetCorpusLinkSelection();
        get().resetSelectedRepeatedDocument();
    },

    isAttributionAvailable: () => {
        const { selectedMessageId, attributionsByMessageId } = get().attribution;
        if (selectedMessageId !== null) {
            const selectedMessageAttribution = attributionsByMessageId[selectedMessageId];

            return selectedMessageAttribution?.isModelSupported !== false;
        }

        return true;
    },
});
