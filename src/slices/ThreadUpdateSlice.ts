import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { AlertMessageSeverity, SnackMessage, SnackMessageType } from './SnackMessageSlice';

export const ABORT_ERROR_MESSAGE: SnackMessage = {
    type: SnackMessageType.Alert,
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped Olmo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export interface ThreadUpdateSlice {
    abortController: AbortController | null;
    streamingMessageId: string | null;
    streamPromptState?: RemoteState;
    isUpdatingMessageContent: boolean;
}
export const createThreadUpdateSlice: OlmoStateCreator<ThreadUpdateSlice> = () => ({
    abortController: null,
    streamingMessageId: null,
    streamPromptState: undefined,
    isUpdatingMessageContent: false,
});
