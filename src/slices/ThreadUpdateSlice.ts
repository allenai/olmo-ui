import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';

import { AlertMessageSeverity, SnackMessage, SnackMessageType } from './SnackMessageSlice';

export const createModelAbortErrorMessage = (modelId: string): SnackMessage => {
    const lowerCaseModelId = modelId.toLocaleLowerCase();
    // TODO: using lower case modelId until familyName is consistently set
    let modelText = 'Olmo';
    if (lowerCaseModelId.includes('molmo') || lowerCaseModelId.includes('mm-olmo')) {
        modelText = 'Molmo';
    }
    if (lowerCaseModelId.includes('qwen3')) {
        modelText = 'Qwen3';
    }
    if (lowerCaseModelId.includes('tulu')) {
        modelText = 'Tülu';
    }

    return {
        type: SnackMessageType.Alert,
        id: `abort-message-${new Date().getTime()}`.toLowerCase(),
        title: 'Response was aborted',
        message: `You stopped ${modelText} from generating answers to your query`,
        severity: AlertMessageSeverity.Warning,
    } as const;
};

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
