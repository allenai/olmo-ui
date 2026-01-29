import { Model } from '@/api/playgroundApi/additionalTypes';
import { OlmoStateCreator } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { getModelFamilyNameFromId } from '@/util';

import { AlertMessageSeverity, SnackMessage, SnackMessageType } from './SnackMessageSlice';

export const createModelAbortErrorMessage = (model: Model): SnackMessage => {
    const modelFamilyName = model.family_name ?? getModelFamilyNameFromId(model.id) ?? 'the model';

    return {
        type: SnackMessageType.Alert,
        id: `abort-message-${new Date().getTime()}`.toLowerCase(),
        title: 'Response was aborted',
        message: `You stopped ${modelFamilyName} from generating answers to your query`,
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
