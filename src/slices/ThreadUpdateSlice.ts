import { Thread } from '@/api/playgroundApi/thread';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { AlertMessageSeverity, SnackMessage, SnackMessageType } from './SnackMessageSlice';

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
    streamPromptState?: RemoteState;
    streamingMessageId: string | null;
    addThreadToAllThreads: (thread: Thread) => void;
}
export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = (set, _get) => ({
    streamPromptState: undefined,
    streamingMessageId: null,

    addThreadToAllThreads: (thread: Thread) => {
        set((state) => ({
            allThreads: [thread, ...state.allThreads],
        }));
    },
});
