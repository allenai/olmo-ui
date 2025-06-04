import { Draft } from 'immer';

import { AttributionClient, Document, TopLevelAttributionSpan } from '@/api/AttributionClient';
import { error } from '@/api/error';
import { getThreadFromCache } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { type AppContextState, OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

export interface MessageWithAttributionDocuments {
    orderedDocumentIndexes: string[];
    documents: { [documentIndex: string]: Document | undefined };
    spans: { [span: string]: TopLevelAttributionSpan | undefined };
    loadingState: RemoteState | null;
    index: string | null;
    attributionRequestError?: 'model-not-supported' | 'request-blocked' | 'overloaded';
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
    unselectDocument: (documentIndex: string) => void;
    resetAttribution: () => void;
    selectMessage: (threadId: string, messageId: string) => void;
    unselectMessage: (messageId: string) => void;
    getAttributionsForMessage: (
        prompt: string,
        threadId: string,
        messageId: string
    ) => Promise<AttributionState>;
    selectSpans: (span: string | string[]) => void;
    resetCorpusLinkSelection: () => void;
    handleAttributionForChangingThread: () => void;
    selectRepeatedDocument: (documentIndex: string) => void;
    resetSelectedRepeatedDocument: () => void;
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

    unselectDocument: (documentIndex: string) => {
        set((state) => {
            if (
                state.attribution.selection?.type === 'document' &&
                state.attribution.selection.documentIndex === documentIndex
            ) {
                state.attribution.selection = null;
            }
        });
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

    selectMessage: (threadId: string, messageId: string) => {
        set(
            (state) => {
                if (state.attribution.selectedMessageId !== messageId) {
                    state.attribution.selectedMessageId = messageId;
                    state.attribution.selection = null;
                }
            },
            false,
            'attribution/selectMessage'
        );

        const thread = getThreadFromCache(threadId);

        const selectedMessage = thread.messages.find((message) => message.id === messageId);
        let prompt = '';
        if (selectedMessage?.role === Role.LLM) {
            const parent = thread.messages.find((message) => message.id === selectedMessage.parent);
            if (parent != null) {
                prompt = parent.content;
            }
        }

        get()
            .getAttributionsForMessage(prompt, threadId, messageId)
            .catch((error: unknown) => {
                throw error;
            });
    },

    unselectMessage: (messageId: string) => {
        set((state) => {
            if (state.attribution.selectedMessageId === messageId) {
                state.attribution.selectedMessageId = null;
                state.attribution.selection = null;
            }
        });
    },

    getAttributionsForMessage: async (
        prompt: string,
        threadId: string,
        messageId: string
    ): Promise<AttributionState> => {
        const message = getThreadFromCache(threadId).messages.find(
            (message) => message.id === messageId
        );

        const messageDocumentsLoadingState =
            get().attribution.attributionsByMessageId[messageId]?.loadingState;

        // If a request is in-flight or finished we don't need to fetch again
        if (
            message?.modelId &&
            messageDocumentsLoadingState !== RemoteState.Loading &&
            messageDocumentsLoadingState !== RemoteState.Loaded
        ) {
            set(
                (state) => {
                    const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                    attributions.loadingState = RemoteState.Loading;
                    attributions.attributionRequestError = undefined;
                },
                false,
                'attribution/startGetAttributionsForMessage'
            );

            try {
                const attributionResponse = await attributionClient.getAttributionDocuments(
                    prompt,
                    message.content,
                    message.modelId
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
                    },
                    false,
                    'attribution/finishGetAttributionsForMessage'
                );
            } catch (e) {
                set(
                    (state) => {
                        const attributions = getAttributionsByMessageIdOrDefault(state, messageId);
                        attributions.loadingState = RemoteState.Error;
                        if (e instanceof error.ValidationError) {
                            if (
                                e.validationErrors.some((validationError) =>
                                    validationError.loc.some((loc) => loc === 'model_id')
                                )
                            ) {
                                attributions.attributionRequestError = 'model-not-supported';
                            } else if (
                                e.validationErrors.some((validationError) =>
                                    validationError.msg.includes('blocked')
                                )
                            ) {
                                attributions.attributionRequestError = 'request-blocked';
                            }
                        }

                        if (e instanceof error.HTTPError) {
                            if (e.status === 503) {
                                attributions.attributionRequestError = 'overloaded';
                            }
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
});
