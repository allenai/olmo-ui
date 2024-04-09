import { FetchInfo, OlmoStateCreator } from '@/AppContext';
import {
    InferenceOpts,
    Message,
    MessagePost,
    isFinalMessage,
    isFirstMessage,
    isMessageChunk,
    isMessageWithMetadata,
    parseMessage,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { AlertMessage, AlertMessageSeverity } from '@/components/GlobalAlertList';
import { errorToAlert } from './AlertMessageSlice';

const ABORT_ERROR_MESSAGE: AlertMessage = {
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    ongoingThreadId: string | null;
    inferenceOpts: InferenceOpts;
    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => void;
    postMessageInfo: FetchInfo<Message>;
    postMessage: (
        newMessage: MessagePost,
        parentMessage?: Pick<Message, 'id' | 'children'>,
        shouldSetSelectedThread?: boolean,
        messagePath?: string[]
    ) => Promise<FetchInfo<Message>>;
    selectedModel: string;
    setSelectedModel: (selectedModel: string) => void;
}

export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, get) => ({
    abortController: null,
    ongoingThreadId: null,
    inferenceOpts: {},
    postMessageInfo: {},

    selectedModel: '',
    setSelectedModel: (model: string) => set({ selectedModel: model }),

    updateInferenceOpts: (newOptions: Partial<InferenceOpts>) => {
        set((state) => ({
            inferenceOpts: { ...state.inferenceOpts, ...newOptions },
        }));
    },

    postMessage: async (
        newMsg: MessagePost,
        parentMsg?: Pick<Message, 'id' | 'children'>,
        shouldSetSelectedThread: boolean = false,
        messagePath: string[] = []
    ) => {
        const state = get();
        const abortController = new AbortController();

        set(
            (state) => {
                state.abortController = abortController;
                state.postMessageInfo.loading = true;
                state.postMessageInfo.error = false;
            },
            false,
            'threadUpdate/startPostMessage'
        );

        // We pass `state` in here to get the immer-wrapped state
        const branch = (state: ReturnType<typeof get>) => {
            if (messagePath.length > 0) {
                let message: Message | undefined;

                // TODO: This CAN get perf-heavy. If perf becomes an issue, look into normalizing the threads and updating through an object access instead of traversing every level of messages
                // For reference about how a normalized store looks/functions, see this redux doc: https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
                // Traverse the tree using the ids provided until we get to where messagePath pointed us
                for (const id of messagePath) {
                    if (message == null) {
                        message = state.allThreadInfo.data.messages.find(
                            (message) => message.id === id
                        );
                    } else {
                        message = message?.children?.find((message) => message.id === id);
                    }
                }

                if (message == null) {
                    throw new Error("Tried to add to a thread that doesn't exist");
                }

                if (message.children == null) {
                    message.children = [];
                }
                return message.children;
            }

            if (parentMsg) {
                parentMsg.children = parentMsg.children ?? [];
            }

            // TODO: by this point allThreadInfo.data should always be set, so silly stuff
            // like this shouldn't be required
            // Note: Ran into issues in tests with sending a message without getting all threads first. It's not a safe assumption that allThreadInfo is defined.
            return parentMsg?.children || state.allThreadInfo.data?.messages || [];
        };

        try {
            const messageChunks = postMessageGenerator(
                newMsg,
                state.inferenceOpts,
                abortController,
                parentMsg?.id
            );

            // We're taking advantage of postMessageGenerator being a generator here and using it as an iterable.
            // See MDN for more info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
            for await (const message of messageChunks) {
                // The first chunk should always be a Message capturing the details of the user's
                // message that was just submitted.
                if (isFirstMessage(message)) {
                    const msg = parseMessage(message);

                    set(
                        (state) => {
                            branch(state).unshift(msg);
                            state.ongoingThreadId = msg.children?.length
                                ? msg.children[0].id
                                : null;

                            // Expand the thread so that the response is visible as it's streamed to the client.(only applied to the pre-refresh UI)
                            state.expandedThreadID = msg.root;

                            // since ThreadDisplay redirects when the id in selectedThreadInfo.data changes we only want to redirect if it's a new thread and not a followup
                            if (shouldSetSelectedThread && messagePath?.length === 0) {
                                state.selectedThreadInfo.data = msg;
                            }
                        },
                        false,
                        'threadUpdate/firstMessage'
                    );
                }

                // After receiving the first part we should expect a series of MessageChunks, each of
                // which constitutes an individual token that's a part of the model's response.
                if (isMessageChunk(message)) {
                    const chunk = message;
                    set(
                        (state) => {
                            // We're able to grab the first child of children here because we assume it's being set from the first message processing
                            const reply = (branch(state)[0]?.children ?? [])[0];
                            reply.content += chunk.content;

                            if (shouldSetSelectedThread) {
                                state.selectedThreadInfo.data!.children![0].content +=
                                    chunk.content;
                            }
                        },
                        false,
                        'threadUpdate/messageChunk'
                    );
                }

                if (isFinalMessage(message)) {
                    // Finally we should receive a Message that represents the fully materialized Message with
                    // with the model's response as a child.
                    const msg = parseMessage(message);

                    set(
                        (state) => {
                            branch(state)[0] = msg;

                            if (shouldSetSelectedThread) {
                                state.pathToLastMessageInThread.push(msg.id, msg.children![0].id);
                            }
                        },
                        false,
                        'threadUpdate/finalMessage'
                    );
                }
            }

            set(
                (state) => {
                    state.abortController = null;
                    state.ongoingThreadId = null;
                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.data = branch(state)[0];
                    state.postMessageInfo.error = false;
                },
                false,
                'threadUpdate/finishPostMessage'
            );
        } catch (err) {
            const addAlertMessage = get().addAlertMessage;

            if (err instanceof Error && err.name === 'AbortError') {
                addAlertMessage(ABORT_ERROR_MESSAGE);
            } else {
                console.error(err);
                addAlertMessage(
                    errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Unable to Submit Message',
                        err
                    )
                );
            }

            set(
                (state) => {
                    state.abortController = null;
                    state.ongoingThreadId = null;
                    state.postMessageInfo.loading = false;
                    state.postMessageInfo.error = true;
                },
                false,
                'threadUpdate/errorPostMessage'
            );
        }

        return get().postMessageInfo;
    },
});
