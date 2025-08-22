import { Message } from '@/api/Message';
import { Thread } from '@/api/playgroundApi/thread';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { AlertMessageSeverity, SnackMessage, SnackMessageType } from './SnackMessageSlice';

export const findChildMessageById = (messageId: string, rootMessage: Message): Message | null => {
    for (const childMessage of rootMessage.children ?? []) {
        if (childMessage.id === messageId) {
            return childMessage;
        }

        const foundChild = findChildMessageById(messageId, childMessage);

        if (foundChild != null) {
            return foundChild;
        }
    }

    return null;
};

export const ABORT_ERROR_MESSAGE: SnackMessage = {
    type: SnackMessageType.Alert,
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export interface StreamMessageRequest {
    content: string;
    captchaToken?: string | null;
    parent?: string;
    files?: FileList;
}

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    streamingMessageId: string | null;
    streamPromptState?: RemoteState;
    isUpdatingMessageContent: boolean;
    addThreadToAllThreads: (thread: Thread) => void;
}
export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set) => ({
    abortController: null,
    streamingMessageId: null,
    streamPromptState: undefined,
    isUpdatingMessageContent: false,

    // used by new react-query code path
    // TODO: replace this whole slice with react-query
    addThreadToAllThreads: (thread: Thread) => {
        set((state) => ({
            allThreads: [thread, ...state.allThreads],
        }));
    },
});
